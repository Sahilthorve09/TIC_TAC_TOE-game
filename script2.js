let boxes = document.querySelectorAll('.box');
    let resetBtn = document.querySelector('#reset');
    let turnO = true; // Player O starts

    const winPatterns = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8]
    ];

    boxes.forEach((box) => {
      box.addEventListener('click', function () {
        if (turnO) {
          box.innerText = 'O';
          box.style.color = 'green';
          turnO = false;
          box.disabled = true;
          checkWinner();
        } else {
          box.innerText = 'X';
          box.style.color = 'black';
          turnO = true;
          box.disabled = true;
          checkWinner();
        }
      });
    });

    const enableBoxes = () => {
      boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
      });
    };

    const disableBoxes = () => {
      boxes.forEach(box => {
        box.disabled = true;
      });
    };

    // Show the winning status (or draw) in an alert and reset the game.
    const showWinner = (winner) => {
      alert(`Congratulations, Winner is ${winner}\nClick OK to continue`);
      resetGame();
    };

    const checkWinner = () => {
      let hasWin = false;
      for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        
        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "" &&
            pos1Val === pos2Val && pos2Val === pos3Val) {
          hasWin = true;
          showWinner(pos1Val);
          return;
        }
      }
      if (!hasWin) {
        const allBoxesFilled = [...boxes].every((box) => box.innerText !== "");
        if (allBoxesFilled) {
          alert("Match Drawn\nClick OK to continue");
          resetGame();
        }
      }
    };

    const resetGame = () => {
      turnO = true;
      enableBoxes();
    };

    resetBtn.addEventListener('click', resetGame);