import nodmailer from 'nodemailer'


export const transporter = nodmailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
        user: 'mitchel2206@gmail.com',
        pass: 'kjvzuthxqbpdmxny',
    },
})