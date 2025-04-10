import { useState, useEffect } from "react";

function Quiz() {
  const [array, setArray] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [score, setScore] = useState(0); // Tracks user's score
  const [selectedOption, setSelectedOption] = useState(null); 
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const getRequest = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://opentdb.com/api.php?amount=10");
        if (!response.ok) {
          throw new Error(`Error ${response.status} not found`);
        }
        const data = await response.json();
        setArray(data.results); // Use `results` from API response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };
    getRequest();
  }, []);

  const handleNext = () => {
    if (currentIndex < array.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null); 
    } else {
      setQuizComplete(true); 
    }
  };

  const checkOption = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue); 

    const correctAnswer = array[currentIndex].correct_answer;
    if (selectedValue === correctAnswer) {
      setScore(score + 1);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (array.length === 0) {
    return <p>No questions available. Please try again later.</p>;
  }

  return (
    <div className="container">
      {quizComplete ? (
    
        <div>
          <p>Quiz Complete!</p>
          <p>Your final score is: {score} out of {array.length}</p>
<pre>Made with ❤️ by Vishal</pre>
        </div>
      ) : (
    
        <>
          <p>Question No {currentIndex + 1}</p>
          <p dangerouslySetInnerHTML={{ __html: array[currentIndex].question }}></p>
          <form>
            {[...array[currentIndex].incorrect_answers, array[currentIndex].correct_answer]
              .sort(() => Math.random() - 0.5)
              .map((option, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    id={`option-${i}`}
                    name="quizOption"
                    value={option}
                    onChange={checkOption}
                    checked={selectedOption === option}
                  />
                  <label htmlFor={`option-${i}`}>{option}</label>
                </div>
              ))}
          </form>
          <button onClick={handleNext} disabled={!selectedOption}>
            {currentIndex === array.length - 1 ? "Finish" : "Next"}
          </button>
        </>
      )}
    </div>
  );
}

export default Quiz;
