import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Progress } from '@heroui/react';

export function SurveyResultsPage() {
    const navigate = useNavigate();

    // Mock Data
    const summary = {
        totalResponses: 154,
        completionRate: 85,
        avgTime: '4m 12s',
    };

    return (
        <div className="mx-auto max-w-5xl pb-10">
            <Button
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
                onPress={() => navigate('/apps/surveys')}
                className="mb-4 text-gray-500"
            >
                Back to Surveys
            </Button>

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Survey Results
                    </h1>
                    <p className="text-gray-500">Customer Satisfaction Survey 2024</p>
                </div>
                <Button
                    color="success"
                    variant="flat"
                    startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                    Export CSV
                </Button>
            </div>

            {/* Top Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="border-none bg-white shadow-sm dark:bg-zinc-800">
                    <CardBody className="p-6 text-center">
                        <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                            Total Responses
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {summary.totalResponses}
                        </p>
                    </CardBody>
                </Card>
                <Card className="border-none bg-white shadow-sm dark:bg-zinc-800">
                    <CardBody className="p-6 text-center">
                        <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                            Completion Rate
                        </p>
                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {summary.completionRate}%
                        </p>
                    </CardBody>
                </Card>
                <Card className="border-none bg-white shadow-sm dark:bg-zinc-800">
                    <CardBody className="p-6 text-center">
                        <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                            Avg. Time
                        </p>
                        <p className="mt-2 text-3xl font-bold text-blue-600">{summary.avgTime}</p>
                    </CardBody>
                </Card>
            </div>

            {/* Questions Analysis */}
            <div className="space-y-6">
                <Card className="border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <CardBody className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            1. How satisfied are you with our product?
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Very Satisfied</span>
                                    <span>45% (69)</span>
                                </div>
                                <Progress value={45} color="success" className="h-2" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Satisfied</span>
                                    <span>30% (46)</span>
                                </div>
                                <Progress value={30} color="primary" className="h-2" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Neutral</span>
                                    <span>15% (23)</span>
                                </div>
                                <Progress value={15} color="warning" className="h-2" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Dissatisfied</span>
                                    <span>10% (16)</span>
                                </div>
                                <Progress value={10} color="danger" className="h-2" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    <CardBody className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            2. Which features do you use most?
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Dashboard</span>
                                    <span>80%</span>
                                </div>
                                <Progress value={80} className="h-2" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Reports</span>
                                    <span>65%</span>
                                </div>
                                <Progress value={65} className="h-2" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
