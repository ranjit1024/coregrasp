interface MCQ {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

interface MCQListProps {
    questions: MCQ[];
}

export default function MCQList({ questions }: {questions:any}) {
    if (!questions?.length) {
        return <p className="text-gray-500">No questions generated.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {questions.map((q, qIndex) => (
                <div
                    key={qIndex}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                >
                    <p className="font-medium mb-3">
                        {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                            const isCorrect = optIndex === q.correctIndex;
                            return (
                                <div
                                    key={optIndex}
                                    className={`border rounded-md px-3 py-2 ${
                                        isCorrect
                                            ? "bg-green-100 border-green-500 text-green-800 font-medium"
                                            : "border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {String.fromCharCode(65 + optIndex)}. {opt}
                                    {isCorrect && (
                                        <span className="ml-2 text-xs text-green-700">
                                            (Correct)
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {q.explanation && (
                        <p className="mt-3 text-sm text-gray-600 italic">
                            {q.explanation}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}