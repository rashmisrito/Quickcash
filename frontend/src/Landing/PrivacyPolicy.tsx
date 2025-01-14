import Header from './Header';
import Footer from './Footer';
import { Grid, Typography } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Grid>
       <Header />
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: {xs: '30px', lg: '90px'}, marginBottom: '12px' }}>
         
         <Grid>
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>1. Introduction</Typography>
            <p>
                At Quick Cash (“we,” “us,” or “our”), we value your privacy and are committed to 
                protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, 
                and safeguard your information when you visit our website https://quickcash.oyefin.com and use our services.
            </p>
         </Grid>

         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>2. Information We Collect</Typography>
            <p>
               We may collect personal information from you in various ways, including:

               Registration Information: Name, email address, phone number, and other contact details when you create an account.
               Transaction Data: Information related to your transactions, including payment information and cryptocurrency wallet addresses.
               Usage Data: Data about how you use our website, such as IP address, browser type, pages visited, and the time spent on those pages.
               Cookies and Tracking Technologies: We use cookies to enhance your experience. You can manage your cookie preferences through your browser settings.
            </p>
         </Grid>

         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>3. How We Use Your Information</Typography>
            <p>
                We use your information for the following purposes:

                To provide, maintain, and improve our services.
                To process transactions and send you transaction-related information.
                To communicate with you, including sending updates and marketing materials.
                To comply with legal obligations and prevent fraud.
                To analyze usage and improve our website and services.    
            </p>
         </Grid>

         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>4. Disclosure of Your Information</Typography>
            <p>
                We may share your information in the following circumstances:

                With Service Providers: We may employ third-party companies and individuals to facilitate our services, process payments, or analyze how our service is used.
                For Legal Reasons: We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                Business Transfers: If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that business transaction.
            </p>
         </Grid>

         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>5. Security of Your Information</Typography>
            <p>
                Depending on your jurisdiction, you may have the following rights regarding your personal information:

                The right to access and obtain a copy of your data.
                The right to rectify any inaccurate or incomplete information.
                The right to request the deletion of your personal data.
                The right to object to or restrict processing of your data.
                To exercise these rights, please contact us.      
            </p>
         </Grid>


         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>6. Your Rights</Typography>
            <p>
                We take the security of your personal information seriously and implement appropriate technical and organizational
                measures to protect it. However, no method of transmission over the internet or electronic storage is 100% secure,
                and we cannot guarantee absolute security.      
            </p>
         </Grid>


         <Grid >
            <Typography sx={{ fontWeight: '900', fontSize: '23px' }}>7. Changes to This Privacy Policy</Typography>
            <p>
               We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy
               Policy on this page with a new effective date. We encourage you to review this Privacy Policy periodically for 
               any updates.    
            </p>
         </Grid>

       </Grid>
       <Footer />
    </Grid>
  )
}
