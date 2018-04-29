class Connect4 {
    constructor(selector) {
        this.rows = 6;
        this.cols = 7;
        this.player = 'red';
        this.isGameOver = false;
        this.selector = selector;
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
      const $board = $(this.selector);
      $board.empty();
      this.isGameOver = false;
      this.player = 'red';
        for (let row = 0; row < this.rows; row++) {
          const $row = $('<div>')
            .addClass('row');
          for (let col = 0; col < this.cols; col++) {
            const $col = $('<div>')
            .addClass('col empty')
            .attr('data-col', col)
            .attr('data-row', row);
            $row.append($col);
          }
          $board.append($row);
        }
    }

    setupEventListeners() {
      const $board = $(this.selector);
      const that = this;

      function findLastEmptyCell(col) {
        const cells = $(`.col[data-col='${col}']`)
        for (let i = cells.length - 1; i >= 0; i--) {
            const $cell = $(cells[i]);
            if ($cell.hasClass('empty')) {
                return $cell;
            }
        }
        return null;
        console.log(cells);
      }

      $board.on('mouseenter', '.col.empty', function(){
          if (that.isGameOver) return;
          const col = $(this).data('col');
          const $lastEmptyCell = findLastEmptyCell(col);
          $lastEmptyCell.addClass(`next-${that.player}`);
      });

      $board.on('mouseleave', '.col', function() {
          $('.col').removeClass(`next-${that.player}`);
      });

      $board.on('click', '.col.empty', function() {
          if (that.isGameOver) return;
          const col = $(this).data('col');
          const row = $(this).data('row');
          const $lastEmptyCell = findLastEmptyCell(col);
          $lastEmptyCell.removeClass(`empty next-${that.player}`);
          $lastEmptyCell.addClass(that.player);
          $lastEmptyCell.data('player', that.player);

          const winner = that.checkVictory($lastEmptyCell.data('row'), $lastEmptyCell.data('col'));
          if (winner) {
              that.isGameOver = true;
              $('.col.empty').removeClass('empty');
              alert(`Game over! Player ${that.player} has won!`);
              return;
          }

          that.player = (that.player === 'red') ? 'black' : 'red';
          $(this).trigger('mouseenter');
      });
    }

    checkVictory(row, col) {
        const that = this;

        function $getCell(i, j) {
         return $(`.col[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
          let total = 0;
          let i = row + direction.i;
          let j = col + direction.j;
          let $next = $getCell(i, j);
          while (i >= 0 && i < that.cols & j >= 0 && j < that.cols && $next.data('player') === that.player) {
              total++;
              i += direction.i;
              j += direction.j;
              $next = $getCell(i,j);
          }

          return total;
        }

        function checkWin(a, b){
          const total = 1 +
            checkDirection(a) +
            checkDirection(b);
          if (total >= 4) {
            return that.player;
          } else {
            return null;
          }

        }

        function checkVerticals() {
            return checkWin({i: -1, j:0}, {i:1, j: 0})
        }

        function checkHorizontals() {
            return checkWin({i: 0, j:-1}, {i:0, j: 1})
        }

        function checkDiagBLtoTR() {
            return checkWin({i: 1, j: -1}, {i: 1, j: 1})
        }

        function checkDiagTLtoBR() {
            return checkWin({i: 1, j: 1}, {i: -1, j: -1})
        }

      return checkVerticals() || checkHorizontals() || checkDiagBLtoTR() || checkDiagTLtoBR();
    }

    restart() {
        this.createGrid();
    }
}
