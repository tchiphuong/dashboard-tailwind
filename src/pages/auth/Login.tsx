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
        if (!data.username) newErrors.username = 'Username is required';
        if (!data.password) newErrors.password = 'Password is required';

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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-zinc-900">
            {/* Background decorations */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
                <div className="animate-blob absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10"></div>
                <div className="animate-blob animation-delay-2000 absolute top-[20%] -right-[10%] h-[60%] w-[60%] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10"></div>
                <div className="animate-blob animation-delay-4000 absolute -bottom-[20%] left-[20%] h-[50%] w-[50%] rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-600/10"></div>
            </div>

            <div className="z-10 mx-4 w-full max-w-md">
                <div className="bg-opacity-90 dark:bg-opacity-90 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-2xl backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="p-8 sm:p-10">
                        <div className="mb-10 text-center">
                            <div className="mb-6 inline-flex h-16 w-16 rotate-3 transform items-center justify-center rounded-2xl bg-blue-600 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 hover:rotate-6">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {t('auth.title')}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">{t('auth.subtitle')}</p>
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
                                        return 'Please enter your username';
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
                                color={errors.username ? 'danger' : 'default'}
                                startContent={
                                    <UserIcon className="text-default-400 pointer-events-none h-5 w-5 flex-shrink-0 text-2xl" />
                                }
                                classNames={{
                                    inputWrapper:
                                        'bg-gray-50 dark:bg-zinc-700/50 border-zinc-200 dark:border-zinc-600 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 h-12',
                                    label: 'text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5',
                                    input: 'text-base',
                                }}
                            />

                            <Input
                                isRequired
                                errorMessage={({ validationDetails }) => {
                                    if (validationDetails.valueMissing) {
                                        return 'Please enter your password';
                                    }
                                    return errors.password;
                                }}
                                label={t('auth.password')}
                                labelPlacement="outside"
                                name="password"
                                placeholder="Enter your password"
                                type={isVisible ? 'text' : 'password'}
                                radius="full"
                                variant="flat"
                                color={errors.password ? 'danger' : 'default'}
                                startContent={
                                    <LockClosedIcon className="text-default-400 pointer-events-none h-5 w-5 flex-shrink-0 text-2xl" />
                                }
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                        {isVisible ? (
                                            <EyeSlashIcon className="text-default-400 pointer-events-none h-5 w-5 text-2xl" />
                                        ) : (
                                            <EyeIcon className="text-default-400 pointer-events-none h-5 w-5 text-2xl" />
                                        )}
                                    </button>
                                }
                                classNames={{
                                    inputWrapper:
                                        'bg-gray-50 dark:bg-zinc-700/50 border-zinc-200 dark:border-zinc-600 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 h-12',
                                    label: 'text-md font-medium text-gray-700 dark:text-gray-300 mb-1.5',
                                    input: 'text-base',
                                }}
                            />

                            <div className="flex w-full items-center justify-between px-1 py-2">
                                <Checkbox
                                    name="remember"
                                    size="sm"
                                    classNames={{
                                        label: 'text-small text-gray-700 dark:text-gray-300',
                                    }}
                                >
                                    {t('auth.rememberMe')}
                                </Checkbox>
                                <a
                                    className="text-small text-primary cursor-pointer font-medium hover:underline"
                                    href="#"
                                >
                                    {t('auth.forgotPassword')}
                                </a>
                            </div>

                            <Button
                                className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white shadow-lg shadow-blue-500/30"
                                color="primary"
                                type="submit"
                                radius="full"
                                variant="flat"
                                isLoading={isLoading}
                            >
                                {isLoading ? (
                                    t('auth.loggingIn')
                                ) : (
                                    <span className="flex items-center justify-center">
                                        {t('auth.signIn')}
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </span>
                                )}
                            </Button>

                            {submitted && (
                                <div className="text-small text-default-500 mt-4 hidden text-center">
                                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                                </div>
                            )}
                        </Form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 font-medium tracking-wide text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="group flex items-center justify-center border border-zinc-200 bg-white px-4 py-3 transition-colors duration-200 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-gray-700"
                                radius="full"
                                variant="flat"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                                    alt="Google"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Google
                                </span>
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="group flex items-center justify-center border border-zinc-200 bg-white px-4 py-3 transition-colors duration-200 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-gray-700"
                                radius="full"
                                variant="flat"
                            >
                                <svg
                                    className="h-5 w-5 text-gray-900 transition-transform duration-200 group-hover:scale-110 dark:text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    GitHub
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="border-t border-zinc-100 bg-gray-50 px-8 py-6 text-center dark:border-zinc-700 dark:bg-zinc-700/30">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.dontHaveAccount')}{' '}
                            <a
                                href="#"
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400"
                            >
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
