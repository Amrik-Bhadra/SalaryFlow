const otpEmailTemplate = (otp) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0056b3;">Your One-Time Password (OTP)</h2>
            <p>Hello,</p>
            <p>Your OTP for verification is: <strong style="font-size: 18px; color: #d9534f;">${otp}</strong></p>
            <p>This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</footer>
        </div>
    `;
};

const notificationEmailTemplate = (message) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0056b3;">Notification</h2>
            <p>${message}</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">Your Company Name - All Rights Reserved</footer>
        </div>
    `;
};

const payslipEmailTemplate = (employeeName, month, attachment) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0056b3;">Payslip for ${month}</h2>
            <p>Dear ${employeeName},</p>
            <p>Please find your payslip for <strong>${month}</strong> attached below.</p>
            <p>For any queries, contact HR.</p>
            <hr>
            <footer style="font-size: 12px; color: #666;">Your Company Name - All Rights Reserved</footer>
        </div>
    `;
};

module.exports = { otpEmailTemplate, notificationEmailTemplate, payslipEmailTemplate };
