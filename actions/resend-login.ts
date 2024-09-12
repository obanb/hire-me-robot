"use server"

import {signIn} from "../server/auth";

export default async function resendLogin(formData: FormData) {
    const email = formData.get('email') as string;
    console.log('formdata', email);

    await signIn("resend", {
        email: formData.get('email'),
        redirectTo: `/chat/xxx?email=${encodeURIComponent(email)}`})
}