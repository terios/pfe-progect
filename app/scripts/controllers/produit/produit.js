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

    $scope.uploader = {};
    $scope.listProduit = [];

    $scope.init = function() {
      $rootScope.active = {
        home: '',
        statistic: '',
        produit: 'start active',
        message: '',
        reclamation: '',
        tableBord: ''
      };
      $http.post(configuration.URL_REQUEST + '/getAllProducts')
        .success(function(data) {
          console.log(data);
          $scope.listProduit = data;
        }).error(function() {
          console.log('une erreur');
        });
    };

    $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {
      console.log('file added');
      console.log($flow);
      console.log(flowFile);
      // event.preventDefault(); //prevent file from uploading
    });
    $scope.defineAction = function(param, id) {
      if (param === 1) {
        console.log('ajouter');
        $scope.disableElement = false;
        $scope.actionCall = 'ajouter';
      } else if (param === 2) {
        console.log('modifier');
        $scope.actionCall = 'modifier';
        $scope.detail(id);
      }
    }
    $scope.send = function() {
      if ($scope.actionCall === 'ajouter') {
        console.log('action ajout');
        $scope.ajouterProduit();
      } else if ($scope.actionCall === 'modifier') {
        console.log('action modification');
      }
    }
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
      $('#addProductModal').modal('hide');
      $scope.clearInputs();
      // socket.emit('allProduct');
    };

    $scope.uploadFailed = function(evt) {
      console.log('erreur lors de l\'envoie des données');
    };
    $scope.detail = function(id) {
      $scope.disableElement = true;
      console.log('open detaille');
      console.log(id);
      if (id) {
        $http.post(configuration.URL_REQUEST + '/getProductsById', {
          idProduct: id
        }).success(function(data) {
          console.log('bonne reception');
          console.log(data);

          $scope.nomProduit = data.name;
          $scope.categorieSelected = data.categorie;
          $scope.descriptionProduit = data.description;
          $scope.prixProduit = data.price;
          $scope.nombreProduit = data.amount;

        }).error(function() {
          console.log('une erreur Mister');
        })
      } else {
        console.log('id introuvable');
      }

    }

    $scope.clearInputs = function() {
      $scope.uploader.flow.files = [];
      $scope.nomProduit = '';
      $scope.categorieSelected = '';
      $scope.descriptionProduit = '';
      $scope.prixProduit = '';
      $scope.nombreProduit = '';
    }
    // socket.on('broadcast', function(data) {
    //   $scope.name = data.name;
    //   console.log(data);
    // });
    socket.on('newProductNotification', function(data) {
      console.log(data.lastItem);
      $scope.listProduit.push(data.lastItem);
      console.log(data);
    });

  });