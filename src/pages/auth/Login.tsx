import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    UserIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Checkbox, Form } from '@heroui/react';

export function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);

    // Form state
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = React.useState<any>(null);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation
        const newErrors: { [key: string]: string } = {};
        if (!data.username) newErrors.username = "Username is required";
        if (!data.password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSubmitted(data);
            localStorage.setItem('token', 'fake-jwt-token');
            navigate('/dashboard');
        }, 1500);
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Login with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-400/20 dark:bg-pink-600/10 blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full mx-4 z-10">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                                {t('auth.title')}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('auth.subtitle')}
                            </p>
                        </div>

                        <Form
                            className="w-full space-y-4"
                            validationBehavior="native"
                            onSubmit={onSubmit}
                            validationErrors={errors}
                        >
                            <Input
                                isRequired
                                errorMessage={({ validationDetails }) => {
                                    if (validationDetails.valueMissing) {
                                        return "Please enter your username";
                                    }
                                    return errors.username;
                                }}
                                label={t('auth.username')}
                                labelPlacement="outside"
                                name="username"
                                placeholder="Enter your username"
                                type="text"
                                radius="full"
                                variant="flat"
                                color={errors.username ? "danger" : "default"}
                                startContent={
                                    <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 w-5 h-5" />
                                }
                                classNames={{
                                    inputWrapper: "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 h-12",
                                    label: "text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5",
                                    input: "text-base",
                                }}
                            />

                            <Input
                                isRequired
                                errorMessage={({ validationDetails }) => {
                                    if (validationDetails.valueMissing) {
                                        return "Please enter your password";
                                    }
                                    return errors.password;
                                }}
                                label={t('auth.password')}
                                labelPlacement="outside"
                                name="password"
                                placeholder="Enter your password"
                                type={isVisible ? "text" : "password"}
                                radius="full"
                                variant="flat"
                                color={errors.password ? "danger" : "default"}
                                startContent={
                                    <LockClosedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 w-5 h-5" />
                                }
                                endContent={
                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                        {isVisible ? (
                                            <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="text-2xl text-default-400 pointer-events-none w-5 h-5" />
                                        )}
                                    </button>
                                }
                                classNames={{
                                    inputWrapper: "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 h-12",
                                    label: "text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5",
                                    input: "text-base",
                                }}
                            />

                            <div className="flex w-full items-center justify-between px-1 py-2">
                                <Checkbox
                                    name="remember"
                                    size="sm"
                                    classNames={{
                                        label: "text-small text-gray-700 dark:text-gray-300"
                                    }}
                                >
                                    {t('auth.rememberMe')}
                                </Checkbox>
                                <a className="text-small text-primary hover:underline cursor-pointer font-medium" href="#">
                                    {t('auth.forgotPassword')}
                                </a>
                            </div>

                            <Button
                                className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                color="primary"
                                type="submit"
                                radius="full"
                                variant="flat"
                                isLoading={isLoading}
                            >
                                {isLoading ? t('auth.loggingIn') : (
                                    <span className="flex items-center justify-center">
                                        {t('auth.signIn')}
                                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                                    </span>
                                )}
                            </Button>

                            {submitted && (
                                <div className="text-small text-default-500 mt-4 text-center hidden">
                                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                                </div>
                            )}
                        </Form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                radius="full"
                                variant="flat"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" alt="Google" />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">Google</span>
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-700   bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                radius="full"
                                variant="flat"
                            >
                                <svg className="h-5 w-5 text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">GitHub</span>
                            </Button>
                        </div>
                    </div>
                    <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.dontHaveAccount')}{' '}
                            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                                {t('auth.signUp')}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            {/* Custom Animation Styles */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
