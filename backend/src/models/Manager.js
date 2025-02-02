const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const managerSchema = new mongoose.Schema({
    managerCode: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            // This will be replaced by the generateManagerCode method
            return 'AWM1001';
        }
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
        }
    },
    assignedArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the pre-save middleware to handle managerCode generation
managerSchema.pre('save', async function(next) {
    try {
        // Generate managerCode for new documents
        if (this.isNew) {
            this.managerCode = await this.constructor.generateManagerCode();
        }

        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        
        // Clean up strings
        this.email = this.email.trim().toLowerCase();
        this.firstName = this.firstName.trim();
        this.lastName = this.lastName.trim();
        this.phone = this.phone.trim();

        // Check for existing email
        if (this.isNew || this.isModified('email')) {
            const existingManager = await this.constructor.findOne({ 
                email: this.email,
                _id: { $ne: this._id } // Exclude current document when checking
            });
            if (existingManager) {
                throw new Error('A manager with this email already exists');
            }
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Improve the generateManagerCode method
managerSchema.statics.generateManagerCode = async function() {
    try {
        const prefix = 'AWM';
        const startNumber = 1001;
        
        const lastManager = await this.findOne({})
            .sort({ managerCode: -1 })
            .select('managerCode');
        
        if (!lastManager || !lastManager.managerCode) {
            return `${prefix}${startNumber}`;
        }

        const lastNumber = parseInt(lastManager.managerCode.replace(prefix, ''));
        if (isNaN(lastNumber)) {
            console.error('Invalid last manager code:', lastManager.managerCode);
            return `${prefix}${startNumber}`;
        }

        const nextNumber = lastNumber + 1;
        return `${prefix}${nextNumber}`;
    } catch (error) {
        console.error('Error generating manager code:', error);
        throw error;
    }
};

managerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

managerSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('A manager with this email already exists'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Manager', managerSchema);