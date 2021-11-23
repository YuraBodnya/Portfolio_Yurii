$(function(){
  const btn = $('#btn-start');
  const container = $('#container');
  let checkEl = '';
  let index = null;
  let figuresSrc = [
    'circle.png',
    'romb.png',
    'square.png',
    'Star.png',
    'treugolnik.png'
  ];
  figuresSrc = figuresSrc.concat(figuresSrc);

  createEl(figuresSrc);

  btn.on('click' ,  rotateAll);

  function game(){
    container.on('click' , '.card' , rotateAndCheck);
  }

  function createEl(figures){
    container.html('');
    shuffle(figuresSrc);
    const content = figures.map(item=>`
    <div class="card" data-check="img/${item}">
      <div class="card__face card__face--front fix-card">
        <img src="img/${item}">
      </div>
      <div class="card__face card__face--back">
        <img src="img/1.jpg">
      </div>
    </div>
    `);
    container.append(...content);
  }

  function rotateAll(){
    $('.card').toggleClass('is-flipped');
    btn.off('click' ,  rotateAll);
    btn.html('Finish');
    btn.on('click' , surrender);
    game();
  }

  function surrender(){
    btn.off('click' , surrender);
    $('.card').removeClass('is-flipped');
    $(this).delay(2000).queue(function(){
      $(this).dequeue();
      container.off('click' , '.card' , rotateAndCheck);
      $('.card').toggleClass('is-flipped');
    });
    $(this).delay(2000).queue(function(){
      $(this).dequeue();
      container.on('click' , '.card' , rotateAndCheck);
      restart();
    });
  }

  function rotateAndCheck(){
    const card = $('.card');
    if($(this).hasClass('is-flipped')){
      const src = $(this).find('img').attr('src');
      if(checkEl != ''){
          if(checkEl == $(this).attr('data-check')){
            $(this).toggleClass('is-flipped')
              .css('background-color', 'rgba(255,255,255,0.8)');
            $('.card').eq(index).css('background-color' , 'rgba(255,255,255,0.8)');
            checkEl = '';
            index = '';
          }
          else{
            $(this).toggleClass('is-flipped');
            container.off('click' , '.card' , rotateAndCheck);
            $(this).delay(2000).queue(function() {
              $(this).toggleClass('is-flipped').dequeue();
              $('.card').eq(index).toggleClass('is-flipped');
              checkEl = '';
              index = '';
              container.on('click' , '.card' , rotateAndCheck);
            });
          }
      }
      else{
        $(this).removeClass('is-flipped');
        index = $(this).index();
        $(this).attr('data-check' , src);
        checkEl =  src;
      }
      if(!card.hasClass('is-flipped')) finishGameWin();
    }
  }

  function finishGameWin(){
    btn.off('click' , surrender);
    $('<div/>',{
      'class': 'win-block',
      'css' :{
        'width' : '300px',
        'height' : '100px',
        'position': 'absolute',
        'left' : '50%',
        'top' : '50%',
        'color':'#fff',
        'border' : '1px solid #000',
        'text-align': 'center',
        'line-height': '100px',
        'border-radius': '15px',
        'background-color': 'red',
        'transform': 'translate(-50%, -50%)',
        'font-size': '30px',
        'font-weight': 'bold',
        'z-index': 9999
      },
      'text' : 'Yeeeees! You win!'
      
    }).appendTo(container);
    btn.on('click' , restart);
  }

  function restart(){
    btn.off('click' , restart);
    btn.html('Start');
    $('.win-block').remove();
    $('.card').addClass('is-flipped');
    createEl(figuresSrc);
    btn.on('click' ,  rotateAll);
}

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }
});



