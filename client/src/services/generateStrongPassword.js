const generateStrongPassword = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const length = 20;
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        password += randomChar;
    }
    return password;
};

export default generateStrongPassword;