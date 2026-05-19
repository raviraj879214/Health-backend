export class EmailTemplate {
  static getTemplate(emailText?: string): string {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb; padding:30px 0; font-family:Arial, sans-serif;">
        <tr>
          <td align="center">

            <!-- CARD WRAPPER -->
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

              <!-- HEADER -->
              <tr>
                <td style="padding:25px; text-align:center; background:#ffffff; border-bottom:1px solid #f0f0f0;">
                  <img src="https://itravelforhealth.com/_next/image?url=%2Fimages%2Flogo.png&w=750&q=75" 
                       alt="I Travel Health Tech" 
                       style="max-width:160px;">
                </td>
              </tr>

              <!-- MAIN BODY -->
              <tr>
                <td style="padding:15px 30px; font-size:16px; color:#444;">
                  ${emailText}
                  <br>
                  If you have any questions, feel free to reply to below email.<br>
                  We're always here to help 
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#eef1f5; padding:18px 0; text-align:center; font-size:12px; color:#888;">
                  © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_PROJECT_NAME}. All rights reserved.<br>
                  
                  Email: ${process.env.POSTMARK_EMAIL}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    `;
  }
}
