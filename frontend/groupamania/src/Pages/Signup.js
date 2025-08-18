import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, Church, UserPlus } from 'lucide-react';
import config from '../config.json';

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState({});

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [showMessage, setShowMessage] = useState(false);

    const handleChange = (event) => {
        console.log(event.target.name + ":" + event.target.value);

        setValues(values => ({
            ...values,
            [event.target.name]: event.target.value,
        }));

        if (formErrors[event.target.name]) {
            setFormErrors({
                ...formErrors,
                [event.target.name]: ''
            });
        }
    };

    const validate = () => {
        const errors = {};

        if (values.name.length < 3) {
            errors.name = "Name should be atleast 3 caracters long";
        }
        if (!values.email) {
            errors.email = 'Please insert an email';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Invalid email';
        }
        if (values.password.length < 5) {
            errors.password = 'Password should be atleast 5 caracters long';
        }
        if (values.confirmedPassword !== values.password) {
            errors.confirmedPassword = 'Should be the same as password!';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate(values)) {
            console.log(values);
            setIsLoading(true);
            fetch(`${config.apiEndpoint}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setIsLoading(false);
                    if (data.message === 'User created!') {
                        navigate(`/`);
                    }
                    else {
                        alert('Unauthorized');
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                    console.error('Error:', error);
                });
            console.log('Tokosss!');
        }
        else {
            setShowMessage(false);
        }
    };

    const passwordStrength = () => {
        const pass = values.password;
        if (pass.length === 0) return null;
        if (pass.length < 5) return 'weak';
        if (pass.length < 8) return 'medium';
        return 'strong';
    };

    const strengthColor = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-green-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg mb-4 hover:scale-110 transition-transform duration-300">
                            <Church className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            EEC Melen
                        </h1>
                        <p className="text-gray-600 mt-2">Créez votre compte pour nous rejoindre</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                            Register
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name:
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className={`h-5 w-5 transition-colors duration-200 ${
                                            focused.name ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocused({ ...focused, name: true })}
                                        onBlur={() => setFocused({ ...focused, name: false })}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                                            formErrors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Name"
                                    />
                                </div>
                                {formErrors.name && (
                                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email:
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className={`h-5 w-5 transition-colors duration-200 ${
                                            focused.email ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocused({ ...focused, email: true })}
                                        onBlur={() => setFocused({ ...focused, email: false })}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                                            formErrors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Email"
                                    />
                                </div>
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password:
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors duration-200 ${
                                            focused.password ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocused({ ...focused, password: true })}
                                        onBlur={() => setFocused({ ...focused, password: false })}
                                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                                            formErrors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.password}
                                    </p>
                                )}
                                {values.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-600">Password strength</span>
                                            <span className="text-gray-600">
                                                {passwordStrength() === 'weak' && 'Weak'}
                                                {passwordStrength() === 'medium' && 'Medium'}
                                                {passwordStrength() === 'strong' && 'Strong'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${strengthColor[passwordStrength()]}`}
                                                style={{
                                                    width: passwordStrength() === 'weak' ? '33%' :
                                                        passwordStrength() === 'medium' ? '66%' : '100%'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmed-pass" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password:
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors duration-200 ${
                                            focused.confirmedPassword ? 'text-blue-500' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmedPassword"
                                        id="confirmed-pass"
                                        value={values.confirmedPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocused({ ...focused, confirmedPassword: true })}
                                        onBlur={() => setFocused({ ...focused, confirmedPassword: false })}
                                        className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                                            formErrors.confirmedPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.confirmedPassword && (
                                    <p className="mt-1 text-sm text-yellow-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.confirmedPassword}
                                    </p>
                                )}
                                {values.confirmedPassword && values.password === values.confirmedPassword && (
                                    <p className="mt-1 text-sm text-green-600 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Passwords match!
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                                }`}
                                style={{ backgroundColor: isLoading ? '' : '#0F6E5A' }}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Register
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                    Se connecter
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;