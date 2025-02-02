module.exports = (req, res, next) => {
    const { body } = req;

    // Example validation rules
    const validationRules = {
        // Add your validation rules here
        // e.g., 'username': 'required|string',
        // e.g., 'email': 'required|email',
    };

    // Perform validation
    for (const field in validationRules) {
        const rules = validationRules[field].split('|');
        for (const rule of rules) {
            switch (rule) {
                case 'required':
                    if (!body[field]) {
                        return res.status(400).json({ error: `${field} is required` });
                    }
                    break;
                case 'string':
                    if (typeof body[field] !== 'string') {
                        return res.status(400).json({ error: `${field} must be a string` });
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(body[field])) {
                        return res.status(400).json({ error: `${field} must be a valid email` });
                    }
                    break;
                // Add more validation rules as needed
            }
        }
    }

    next();
};