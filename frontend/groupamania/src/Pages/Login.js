import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/userService';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/tokens/tokenSlice';
import { Eye, EyeOff, Mail, Lock, LogIn, Church, AlertCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({ email: '', password: '' });
    const [focused, setFocused] = useState({});

    const loginMutation = useMutation(login, {
        onSuccess: (data) => {
            const { token } = data;
            dispatch(setToken(token));
            localStorage.setItem('token', token);
            if (data.hasOwnProperty('token')) {
                navigate(`/timeline/${data.username}`);
            }
        },
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(values);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-green-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full shadow-lg mb-4 hover:scale-110 transition-transform duration-300">
                        <Church className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        EEC Melen
                    </h1>
                    <p className="text-gray-600 mt-2">Bienvenue, connectez-vous à votre compte</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        Connexion
                    </h2>

                    {loginMutation.isError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">Email ou mot de passe incorrect</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
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
                                    required
                                    value={values.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused({ ...focused, email: true })}
                                    onBlur={() => setFocused({ ...focused, email: false })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                                    placeholder="exemple@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
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
                                    required
                                    value={values.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused({ ...focused, password: true })}
                                    onBlur={() => setFocused({ ...focused, password: false })}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                />
                                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                Mot de passe oublié?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isLoading}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                loginMutation.isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {loginMutation.isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Ou</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Pas encore de compte?{' '}
                                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                    Créer un compte
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        En vous connectant, vous acceptez nos{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Conditions d'utilisation</a>
                        {' '}et notre{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Politique de confidentialité</a>
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default Login;