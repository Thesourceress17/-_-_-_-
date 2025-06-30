// מאגר הפעלים למשחק
const verbPairs = [
    { active: "כותב", passive: "נכתב", type: "active" },
    { active: "קורא", passive: "נקרא", type: "active" },
    { active: "בונה", passive: "נבנה", type: "active" },
    { active: "מציא", passive: "נמצא", type: "active" },
    { active: "אוכל", passive: "נאכל", type: "active" },
    { active: "שובר", passive: "נשבר", type: "active" },
    { active: "פותח", passive: "נפתח", type: "active" },
    { active: "סוגר", passive: "נסגר", type: "active" },
    { active: "מכין", passive: "מוכן", type: "active" },
    { active: "שולח", passive: "נשלח", type: "active" },
    { active: "נכתב", passive: "כותב", type: "passive" },
    { active: "נקרא", passive: "קורא", type: "passive" },
    { active: "נבנה", passive: "בונה", type: "passive" },
    { active: "נמצא", passive: "מצא", type: "passive" },
    { active: "נאכל", passive: "אוכל", type: "passive" },
    { active: "נשבר", passive: "שובר", type: "passive" },
    { active: "נפתח", passive: "פותח", type: "passive" },
    { active: "נסגר", passive: "סוגר", type: "passive" },
    { active: "מוכן", passive: "מכין", type: "passive" },
    { active: "נשלח", passive: "שולח", type: "passive" }
];

// משתני המשחק
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentVerb = null;
let userTypeChoice = null;
let shuffledVerbs = [];

// אלמנטי DOM
const currentVerbEl = document.getElementById('current-verb');
const verbTypeHintEl = document.getElementById('verb-type-hint');
const activeBtnEl = document.getElementById('active-btn');
const passiveBtnEl = document.getElementById('passive-btn');
const inputSectionEl = document.getElementById('input-section');
const oppositeVerbEl = document.getElementById('opposite-verb');
const submitBtnEl = document.getElementById('submit-btn');
const feedbackEl = document.getElementById('feedback');
const nextBtnEl = document.getElementById('next-btn');
const correctScoreEl = document.getElementById('correct-score');
const wrongScoreEl = document.getElementById('wrong-score');
const totalScoreEl = document.getElementById('total-score');
const questionNumberEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const progressFillEl = document.getElementById('progress-fill');

// אתחול המשחק
function initGame() {
    shuffledVerbs = [...verbPairs].sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    updateScore();
    loadNextQuestion();
}

// טעינת שאלה חדשה
function loadNextQuestion() {
    if (currentQuestion >= 10) {
        endGame();
        return;
    }

    currentVerb = shuffledVerbs[currentQuestion];
    currentVerbEl.textContent = currentVerb.active;
    verbTypeHintEl.textContent = "זהה: האם זה פועל פעיל או סביל?";
    
    // איפוס הממשק
    resetInterface();
    
    // עדכון מספר השאלה
    questionNumberEl.textContent = currentQuestion + 1;
    updateProgress();
}

// איפוס הממשק
function resetInterface() {
    activeBtnEl.classList.remove('selected');
    passiveBtnEl.classList.remove('selected');
    inputSectionEl.style.display = 'none';
    oppositeVerbEl.value = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    nextBtnEl.style.display = 'none';
    userTypeChoice = null;
    
    // הפעלת כפתורי הבחירה
    activeBtnEl.disabled = false;
    passiveBtnEl.disabled = false;
}

// טיפול בבחירת סוג הפועל
function handleTypeChoice(chosenType) {
    userTypeChoice = chosenType;
    
    // עדכון המראה
    activeBtnEl.classList.remove('selected');
    passiveBtnEl.classList.remove('selected');
    
    if (chosenType === 'active') {
        activeBtnEl.classList.add('selected');
    } else {
        passiveBtnEl.classList.add('selected');
    }
    
    // הצגת תיבת הקלט
    inputSectionEl.style.display = 'block';
    oppositeVerbEl.focus();
    
    // עדכון הרמז
    if (chosenType === 'active') {
        verbTypeHintEl.textContent = "כתוב את הפועל הסביל המתאים:";
    } else {
        verbTypeHintEl.textContent = "כתוב את הפועל הפעיל המתאים:";
    }
}

// בדיקת התשובה
function checkAnswer() {
    if (!userTypeChoice) {
        alert('אנא בחר תחילה האם הפועל פעיל או סביל');
        return;
    }
    
    const userOppositeVerb = oppositeVerbEl.value.trim();
    if (!userOppositeVerb) {
        alert('אנא כתוב את הפועל ההפוך');
        return;
    }
    
    // בדיקה האם זיהה נכון את סוג הפועל
    const typeCorrect = userTypeChoice === currentVerb.type;
    
    // בדיקה האם כתב נכון את הפועל ההפוך
    const oppositeCorrect = userOppositeVerb === currentVerb.passive;
    
    // הכנת הפידבק
    let feedbackText = '';
    let isCorrect = typeCorrect && oppositeCorrect;
    
    if (isCorrect) {
        feedbackText = '🎉 מעולה! זיהית נכון והפוך נכון!';
        feedbackEl.className = 'feedback correct bounce';
        correctAnswers++;
    } else {
        feedbackText = '❌ לא נכון. ';
        if (!typeCorrect) {
            feedbackText += `הפועל "${currentVerb.active}" הוא ${currentVerb.type === 'active' ? 'פעיל' : 'סביל'}. `;
        }
        if (!oppositeCorrect) {
            feedbackText += `ההפך הנכון הוא: "${currentVerb.passive}"`;
        }
        feedbackEl.className = 'feedback wrong shake';
        wrongAnswers++;
    }
    
    feedbackEl.textContent = feedbackText;
    
    // השבתת הכפתורים
    activeBtnEl.disabled = true;
    passiveBtnEl.disabled = true;
    submitBtnEl.disabled = true;
    oppositeVerbEl.disabled = true;
    
    // הצגת כפתור השאלה הבאה
    nextBtnEl.style.display = 'block';
    
    // עדכון הציון
    updateScore();
}

// מעבר לשאלה הבאה
function nextQuestion() {
    currentQuestion++;
    submitBtnEl.disabled = false;
    oppositeVerbEl.disabled = false;
    loadNextQuestion();
}

// עדכון הציון
function updateScore() {
    correctScoreEl.textContent = correctAnswers;
    wrongScoreEl.textContent = wrongAnswers;
    totalScoreEl.textContent = correctAnswers + wrongAnswers;
}

// עדכון סרגל ההתקדמות
function updateProgress() {
    const progress = ((currentQuestion + 1) / 10) * 100;
    progressFillEl.style.width = progress + '%';
}

// סיום המשחק
function endGame() {
    const percentage = Math.round((correctAnswers / 10) * 100);
    let message = `🎊 המשחק הסתיים!\n\n`;
    message += `ענית נכון על ${correctAnswers} מתוך 10 שאלות (${percentage}%)\n\n`;
    
    if (percentage >= 80) {
        message += `🌟 מעולה! אתה מבין היטב פעלים סביל ופעיל!`;
    } else if (percentage >= 60) {
        message += `👍 טוב מאוד! עוד קצת תרגול ותהיה מושלם!`;
    } else {
        message += `💪 כדאי להמשיך להתרגל. תנסה שוב!`;
    }
    
    message += `\n\nרוצה לשחק שוב?`;
    
    if (confirm(message)) {
        initGame();
    }
}

// מאזיני אירועים
activeBtnEl.addEventListener('click', () => handleTypeChoice('active'));
passiveBtnEl.addEventListener('click', () => handleTypeChoice('passive'));
submitBtnEl.addEventListener('click', checkAnswer);
nextBtnEl.addEventListener('click', nextQuestion);

// טיפול ב-Enter בתיבת הקלט
oppositeVerbEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// אתחול המשחק כשהדף נטען
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting game...');
    initGame();
});

// גם גיבוי אם DOMContentLoaded לא עובד
window.onload = function() {
    console.log('Window loaded, starting game...');
    if (currentVerbEl && currentVerbEl.textContent === 'טוען קבצים...') {
        initGame();
    }
};
