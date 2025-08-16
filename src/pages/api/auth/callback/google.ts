
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase-admin';

const db = getFirestore(app);

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state: userId, error } = req.query;

  if (error) {
    return res.redirect(`/integrations?error=${encodeURIComponent(error as string)}`);
  }

  if (!code || typeof code !== 'string' || !userId || typeof userId !== 'string') {
    return res.redirect('/integrations?error=Invalid_request_from_Google');
  }

  try {
    // Exchange the authorization code for an access token and a refresh token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Use the access token to get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    
    if (!userInfo.email) {
        throw new Error("Could not retrieve email from Google profile.");
    }

    // Store tokens and user details in Firestore
    const integrationRef = doc(db, `users/${userId}/integrations/gmail`);
    await setDoc(integrationRef, {
        id: 'gmail',
        connectedAt: serverTimestamp(),
        details: {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
        },
        tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            expiry_date: tokens.expiry_date,
        },
    }, { merge: true });

    // Redirect user back to the integrations page with a success flag
    res.redirect('/integrations?success=true');

  } catch (err: any) {
    console.error("Error during Google OAuth callback:", err);
    const errorMessage = err.message || 'An unknown error occurred during authentication.';
    res.redirect(`/integrations?error=${encodeURIComponent(errorMessage)}`);
  }
}
