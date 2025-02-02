module.exports = {
    sendEmail: (to, subject, text) => {
        // Implementation for sending email notifications
        // This could use a service like Nodemailer or SendGrid
        console.log(`Sending email to: ${to}, Subject: ${subject}, Text: ${text}`);
    },
    
    sendJobRequestNotification: (clientEmail, jobDetails) => {
        const subject = 'New Job Request Submitted';
        const text = `You have submitted a new job request: ${jobDetails}`;
        this.sendEmail(clientEmail, subject, text);
    },

    sendQuotationResponseNotification: (managerEmail, quotationDetails) => {
        const subject = 'New Quotation Response';
        const text = `You have received a new response for your quotation: ${quotationDetails}`;
        this.sendEmail(managerEmail, subject, text);
    },

    sendJobCompletionNotification: (clientEmail, jobDetails) => {
        const subject = 'Job Completed';
        const text = `Your job has been completed: ${jobDetails}`;
        this.sendEmail(clientEmail, subject, text);
    }
};