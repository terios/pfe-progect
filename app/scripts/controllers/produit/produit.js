'use strict';
angular.module('pfeApp').controller('ProduitCtrl',
  function($scope, $rootScope, $http, configuration, serviceGeneral, socket) {
    $scope.state = false;

    $scope.ListCategorieProduit = [{
      name: 'SmartPhone'
    }, {
      name: 'Ordinateur'
    }, {
      name: 'Accessoire'
    }, {
      name: 'ComposantInterne'
    }];

    $scope.descriptionProduit = '';
    $scope.prixProduit = 0;
    $scope.nombreProduit = 0;
    $scope.uploader = {};

    $scope.init = function() {
      console.log(configuration.URL_REQUEST);
      $rootScope.active = {
        home: '',
        statistic: '',
        produit: 'active',
        message: '',
        reclamation: '',
        tableBord: ''
      };
      console.log('init du Produit');
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

    $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {
      console.log('file added');
      console.log($flow);
      console.log(flowFile);
      // event.preventDefault(); //prevent file from uploading
    });

    $scope.ajouterProduit = function() {
      $scope.inisilizeErreur();
      console.log($scope.uploader.flow.files);
      if ($scope.nomProduit && serviceGeneral.isInt($scope.nombreProduit) && _.isNumber($scope.prixProduit) && $scope.categorieSelected) {
        // console.log($scope.categorieSelected);
        console.log('tout est correct');
        var dataToSend = {
          name: $scope.nomProduit,
          categorie: $scope.categorieSelected.name,
          description: $scope.descriptionProduit,
          price: $scope.prixProduit,
          amount: $scope.nombreProduit
        };
        var fd = new FormData();
        if ($scope.uploader.flow.files.length > 0) {
          for (var i in $scope.uploader.flow.files) {
            fd.append('uploadedFile', $scope.uploader.flow.files[i].file);
          }
        }
        fd.append('productData', JSON.stringify(dataToSend));
        var xhr = new XMLHttpRequest();
        // xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener('load', $scope.uploadComplete, false);
        xhr.addEventListener('error', $scope.uploadFailed, false);
        // xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open('POST', 'http://localhost:3000' + '/ajouterProduit');
        xhr.send(fd);

      } else {
        if (!serviceGeneral.isInt($scope.nombreProduit)) {
          $scope.erreurQuantite = 'La quantité doit etre un nombre entier';
        }
        if (!_.isNumber($scope.prixProduit)) {
          $scope.erreurPrix = 'Le prix doit etre un nombre';
        }
        if (!$scope.categorieSelected) {
          $scope.erreurCategorie = 'Veuillez selectionne une categorie';
        }
        if (!$scope.nomProduit || $scope.nomProduit.length < 1) {
          $scope.erreurNom = 'Le nom ne doit pas etre vide';
        }
      }
    };

    $scope.inisilizeErreur = function() {
      $scope.erreurNom = '';
      $scope.erreurCategorie = '';
      $scope.erreurPrix = '';
      $scope.erreurQuantite = '';
    };

    $scope.uploadComplete = function(evt) {
      console.log('upload terminer');
      // socket.emit('allProduct');
    };

    $scope.uploadFailed = function(evt) {
      console.log('erreur lors de l\'envoie des données');
    };

    // socket.on('broadcast', function(data) {
    //   $scope.name = data.name;
    //   console.log(data);
    // });

    socket.on('second', function(data) {
      $scope.name = data.name;
      console.log(data);
    });

  });