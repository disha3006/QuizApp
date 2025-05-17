import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

const socket = io("ws://localhost:5000");

function App() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [scores, setScores] = useState([]);
  const [winner, setWinner] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) {
      setInfo(true);
    }
  };

  useEffect(() => {
    if (seconds === 0) return;
    const timerInterval = setInterval(() => {
      setSeconds(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [seconds]);

  useEffect(() => {
    if (name && info) {
      socket.emit('joinRoom', room, name);
    }
  }, [info, name, room]);

  useEffect(() => {
    socket.on('message', (message) => {
      toast(`${message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      setAnswered(false);
      setSeconds(data.timer);
      setSelectedAnswerIndex(null);
      setCorrectAnswerIndex(null);
    });

    socket.on('answerResult', (data) => {
      setCorrectAnswerIndex(data.correctAnswer);
      if (data.isCorrect) {
        toast.success(`🎉 ${data.playerName} got it right!`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setScores(data.scores);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
    };
  }, []);

  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
      socket.emit('submitAnswer', room, answerIndex);
      setAnswered(true);
    }
  };

  const getAnswerClass = (index) => {
    if (correctAnswerIndex === null) {
      return selectedAnswerIndex === index ? 'selected' : '';
    }
    if (index === correctAnswerIndex) return 'correct';
    if (selectedAnswerIndex === index && index !== correctAnswerIndex) return 'wrong';
    return '';
  };

  const resetGame = () => {
    setWinner('');
    setName('');
    setRoom('');
    setInfo(false);
    setQuestion('');
    setOptions([]);
    setScores([]);
  };

  if (winner) {
    return (
      <div className="winner-screen">
        <h1 className="winner-title">Quiz Champion! 🏆</h1>
        <div className="winner-name">{winner}</div>
        <button className="play-again-btn" onClick={resetGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      {!info ? (
        <div className='join-div'>
          <h1>QuizClash 💡</h1>
          <form onSubmit={handleSubmit}>
            <input 
              required 
              placeholder='Enter your name' 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              required 
              placeholder='Enter room number' 
              value={room} 
              onChange={(e) => setRoom(e.target.value)} 
            />
            <button type='submit' className='join-btn'>
              JOIN GAME
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1>QuizClash 💡</h1>
          <p className='room-id'>Room: {room}</p>
          <ToastContainer />

          {question ? (
            <div className='quiz-div'>
              <div className='timer'>⏱️ {seconds}s remaining</div>
              
              <div className='question'>
                <p className='question-text'>{question}</p>
              </div>
              
              <ul>
                {options.map((answer, index) => (
                  <li key={index}>
                    <button 
                      className={`options ${getAnswerClass(index)}`}
                      onClick={() => handleAnswer(index)} 
                      disabled={answered}
                    >
                      {answer}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className='scoreboard'>
                <h3>Scoreboard</h3>
                {scores.map((player, index) => (
                  <div key={index} className='score-item'>
                    <span>{player.name}</span>
                    <span>{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='quiz-div'>
              <p>Waiting for the first question...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;