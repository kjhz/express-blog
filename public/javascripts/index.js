$(document).ready(function () {
  //显示今天的日期
  $('#today').text(function () {
    const date = new Date();
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      weekday = date.getDay();
    let weekdayTxt;
    switch (weekday) {
      case 0:
        weekdayTxt = "日";
        break;
      case 1:
        weekdayTxt = "一";
        break;
      case 2:
        weekdayTxt = "二";
        break;
      case 3:
        weekdayTxt = "三";
        break;
      case 4:
        weekdayTxt = "四";
        break;
      case 5:
        weekdayTxt = "五";
        break;
      case 6:
        weekdayTxt = "六";
        break;
      default:
        break;
    }
    var text = `${year}年${month}月${day}日 周${weekdayTxt}`;
    return text;
  });
  //下拉菜单,移动端适配
  let dropdownHandler = function () {
    let dropdownElement = $('.dropdown'),
      dropdownMenu = $('nav .dropdown .dropdown-menu'),
      search = $('.search-bar input'),
      catalog = $('.nav-catalog');

    if (window.innerWidth <= 768) {
      catalog.removeAttr('style');
      dropdownMenu.removeAttr('style');
      dropdownElement.unbind();
      search.unbind();
      search.removeAttr('style');
    } else {
      $('.search-bar').removeAttr('style');
      catalog.removeAttr('style');
      dropdownMenu.removeAttr('style');
      dropdownElement.mouseenter(function () {
        $(this).children('.dropdown-menu').show();
      });
      dropdownElement.mouseleave(function () {
        $(this).children('.dropdown-menu').hide();
      });
      search.focus(function () {
        $(this).animate({
          width: '200px'
        });
      })
      search.blur(function () {
        $(this).animate({
          width: '100px'
        });
      })
    }
  };
  dropdownHandler();
  $(window).resize(dropdownHandler);

  $('#nav-search').click(function () {
    $('.search-bar').slideToggle(200);
  });
  $('#nav-button').click(function () {
    $('.nav-catalog').slideToggle(200);
  });

  scrollEvent();

  //监听页面滚动事件
  function scrollEvent() {
    window.onscroll = function (e) {
      scrollFunc();
      let headerElement = $('body>header');
      if (scrollDirection == 'down') {
        //页面向下滚动要做的事情
        var window_scrollTop = $(window).scrollTop();
        if (window_scrollTop > 160) {
          headerElement.slideUp();
        }
      }
      else if (scrollDirection == 'up') {
        //页面向上滚动要做的事情
        headerElement.slideDown();
      }
    }
  }

  var scrollAction = { x: 'undefined', y: 'undefined' }, scrollDirection;
  function scrollFunc() {
    if (typeof scrollAction.x == 'undefined') {
      scrollAction.x = window.pageXOffset;
      scrollAction.y = window.pageYOffset;
    }
    var diffX = scrollAction.x - window.pageXOffset;
    var diffY = scrollAction.y - window.pageYOffset;
    if (diffX < 0) {
      // Scroll right
      scrollDirection = 'right';
    } else if (diffX > 0) {
      // Scroll left
      scrollDirection = 'left';
    } else if (diffY < 0) {
      // Scroll down
      scrollDirection = 'down';
    } else if (diffY > 0) {
      // Scroll up
      scrollDirection = 'up';
    } else {
      // First scroll event
    }
    scrollAction.x = window.pageXOffset;
    scrollAction.y = window.pageYOffset;
  }

  //ajax获得侧边栏需要的数据
  $.getJSON('/api/article_list_latest',function(data) {
    let html=[];
    for (let i=0; i<data.length; i++) {
      let date = new Date(data[i].updated);
      let month = date.getMonth(),
        day = date.getDate();

      html.push(`
        <li>
          <a href='/article/${data[i]._id}'>
            <span class='date'>${day}/${month}</span>
            <span class='title'>${data[i].title}</span>
          </a>
        </li>
      `)
    }
    $('#latestArticle ul').html(html);
  });

  $.getJSON('/api/counts', function(data) {
    $('#articleNum .num').text(data.article_count);
    $('#likesNum .num').text(data.votes_count);
  });
});