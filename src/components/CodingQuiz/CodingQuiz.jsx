import React from "react";
import './CodingQuiz.css'
import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_QUIZ_API_KEY;
const QUIZ_BASE_URL = 'https://quizapi.io/api/v1/questions';
const API_CORRECT_ANSWER_SUFFIX = "_correct";

export default function CodingQuiz() {
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [clickedAnswers, setClickedAnswers] = useState([]);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [newTest, setNewTest] = useState(false);
    
    useEffect(() => {
        const getQuiz = async () => {
            const url = new URL(QUIZ_BASE_URL);
            url.searchParams.set('apiKey', API_KEY);
            url.searchParams.set('category', "Code");
            url.searchParams.set('limit', 5);
            
            const response = await fetch(url);
            const questions = await response.json();
            
            setQuiz(questions);
        }

        getQuiz();
    }, [newTest])

    function updateClickedAnswers(questionIdx, answerIdx, answer){
        const rerenderedArray = [...clickedAnswers]
        rerenderedArray[questionIdx] = answerIdx;
        setClickedAnswers(rerenderedArray);
        if(correct_answers[`${answer}${API_CORRECT_ANSWER_SUFFIX}`] === 'true' ){
            setTotalCorrect(totalCorrect+1);
        }
    }

    function restartQuiz() {
        if (passedTest) {
            setNewTest(true)
        }

        setCurrentQuestionIdx(0)
        setClickedAnswers([])
        setTotalCorrect(0);
    }

    if(quiz == null) return;

    const {question, answers, correct_answers} = quiz[currentQuestionIdx];
    const isFirstQuestion = currentQuestionIdx === 0;
    const isLastQuestion = currentQuestionIdx === quiz.length-1;
    const totalQuestions = quiz.length;
    const passedTest = totalCorrect === totalQuestions;
    const answeredAll = clickedAnswers.length === totalQuestions;
    
    return (
        <>
            <h1>{question}</h1>
            {Object.keys(answers).map((answer, i) => {
                let className = 'answer';
                if (answers[answer] == null) return null;
            
                if (clickedAnswers[currentQuestionIdx] === i){
                    className += correct_answers[`${answer}${API_CORRECT_ANSWER_SUFFIX}`] === 'true' ? ' correct' : ' incorrect';
                }
                
                return (
                    <h2
                        key={answer}
                        className={className}
                        onClick={() => {
                            if(clickedAnswers[currentQuestionIdx] != null) return;
                            updateClickedAnswers(currentQuestionIdx, i, answer)
                        }}
                    >{answers[answer]}</h2>
                )
            })}
            <button
                disabled={isFirstQuestion}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx-1)}
            >
                Back
            </button>
            <button
                disabled={isLastQuestion || clickedAnswers[currentQuestionIdx] == null}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx+1)}
            >
                Next
            </button>
            {answeredAll  && 
                <div className="restart">
                    <h2>Quiz Results: {totalCorrect}/{totalQuestions}</h2>
                    <button  onClick={() => restartQuiz()} >{passedTest ? 'Take a new Test!' : 'Try Again!'}</button>
                </div>
            }
        </>
    );

}