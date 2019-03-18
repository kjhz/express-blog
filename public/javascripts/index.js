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

  $('#nav-search').on('click', 'i', function(event) {
    event.preventDefault();
    $('.search-bar').slideToggle(200);
    alert('d')
  })
  $('#nav-button').on('click', 'i', function (event) {
    event.preventDefault();
    $('.nav-catalog').slideToggle(200);
    alert('i')
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

  //ajax获得最新文章列表，并缓存
  if (sessionStorage.article_list_latest) {
    $('#latestArticle ul').html(sessionStorage.article_list_latest);
  } else {
    $.getJSON('/api/article_list_latest', function (data) {
      let content='';
      for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].updated);
        let month = date.getMonth(),
          day = date.getDate();

        content += `
          <li>
            <a href='/article/${data[i]._id}'>
              <span class='date'>${day}/${month}</span>
              <span class='title'>${data[i].title}</span>
            </a>
          </li>
        `
      }
      sessionStorage.article_list_latest = content;
      $('#latestArticle ul').html(content);
    });
  }

  if (sessionStorage.counts) {
    $('#articleNum .num').text(sessionStorage.article_count);
    $('#likesNum .num').text(sessionStorage.votes_count);
  } else {
    $.getJSON('/api/counts', function (data) {
      const d = JSON.parse(data)
      let articles = d.article_count,
        votes = d.votes_count;
      sessionStorage.article_count = articles;
      sessionStorage.votes_count = votes;
      $('#articleNum .num').text(articles);
      $('#likesNum .num').text(votes);
    });
  }

  if (sessionStorage.tags) {
    $('.mapTags').html(sessionStorage.tags);
  } else {
    $.getJSON('/api/tags', function (data) {
      let content='';
      let tags = sortObj(JSON.parse(data));

      function sortObj(obj) {
        var arr = [];
        for (var i in obj) {
          arr.push([obj[i], i]);
        };
        arr.sort(function (a, b) {
          return b[0] - a[0];
        });
        var len = arr.length,
          obj = {};
        for (var i = 0; i < len; i++) {
          obj[arr[i][1]] = arr[i][0];
        }
        return obj;
      }

      let i = 0;
      for (x in tags) {
        if (i < 20) {
          content += `
            <li>
              <a href='/search?searchType=3&searchValue=${x}'>
                <span>${x}</span>
              </a>
            </li>
          `;
          i++;
        }
      }
      sessionStorage.tags = content;
      $('.mapTags').html(content);
    })
  }
});