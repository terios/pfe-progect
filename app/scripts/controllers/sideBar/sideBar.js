'use strict';
angular.module('pfeApp').controller('SideBarCtrl',
  function($scope, $rootScope) {
    $scope.state = false;
    $scope.produitSubMenu = false;
    $scope.init = function() {
      console.log('init du controller sidebar');
      //   var socket = io.connect('http://localhost:3000');
      //   socket.on('news', function(data) {
      //     if (data.onlineState) {
      //       $scope.state = data.onlineState;
      //     } else {
      //       $scope.state = data.onlineState;
      //     }
      //     $scope.$digest();
      //     socket.emit('my other event', {
      //       my: 'data'
      //     });
      //   });
    };

    $scope.openCollapsed = function() {
      console.log('----->')
      $scope.produitSubMenu = !$scope.produitSubMenu;
    }
    $scope.toggleSideBar = function() {
      var body = $('body');
      var sidebar = $('.page-sidebar');

      if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
        body.removeClass('page-sidebar-hover-on');
        sidebar.css('width', '').hide().show();
        $scope.handleSidebarAndContentHeight(); //fix content & sidebar height
        if ($.cookie) {
          $.cookie('sidebar_closed', '0');
        }
        e.stopPropagation();
        return;
      }

      $(".sidebar-search", sidebar).removeClass("open");

      if (body.hasClass("page-sidebar-closed")) {
        body.removeClass("page-sidebar-closed");
        if (body.hasClass('page-sidebar-fixed')) {
          sidebar.css('width', '');
        }
        if ($.cookie) {
          $.cookie('sidebar_closed', '0');
        }
      } else {
        body.addClass("page-sidebar-closed");
        if ($.cookie) {
          $.cookie('sidebar_closed', '1');
        }
      }
      $scope.handleSidebarAndContentHeight(); //fix content & sidebar height
    }

    $scope.handleSidebarAndContentHeight = function() {
      var content = $('.page-content');
      var sidebar = $('.page-sidebar');
      var body = $('body');
      var height;

      if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
        var available_height = $(window).height() - $('.footer').outerHeight() - $('.header').outerHeight();
        if (content.height() < available_height) {
          content.attr('style', 'min-height:' + available_height + 'px !important');
        }
      } else {
        if (body.hasClass('page-sidebar-fixed')) {
          height = _calculateFixedSidebarViewportHeight();
        } else {
          height = sidebar.height() + 20;
          var headerHeight = $('.header').outerHeight();
          var footerHeight = $('.footer').outerHeight();
          if ($(window).width() > 1024 && (height + headerHeight + footerHeight) < $(window).height()) {
            height = $(window).height() - headerHeight - footerHeight;
          }
        }
        if (height >= content.height()) {
          content.attr('style', 'min-height:' + height + 'px !important');
        }
      }

    }

  }
);