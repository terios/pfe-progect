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
    $scope.barChart = [];
    $scope.totalAmount = 0;
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
          for (var i = 0; i < $scope.ListCategorieProduit.length; i++) {
            var counter = 0;
            for (var y = 0; y < $scope.listProduit.length; y++) {
              // console.log($scope.ListCategorieProduit[i]);
              // console.log($scope.listProduit[y].categorie)
              if ($scope.ListCategorieProduit[i].name === $scope.listProduit[y].categorie) {
                counter = counter + $scope.listProduit[y].amount;
                // console.log($scope.listProduit[y].amount);
              }
            }
            $scope.totalAmount = $scope.totalAmount + counter;
            $scope.barChart.push({
              categorie: $scope.ListCategorieProduit[i],
              amount: counter
            });
          }
          console.log($scope.barChart);
          console.log($scope.totalAmount);
          $scope.productStockChart($scope.barChart);
          // d3.select("#d3donuts")
          //   .selectAll("div")
          //   .data(data)
          //   .enter().append("div")
          //   .style("width", function(d) {
          //     return d * 10 + "px";
          //   })
          //   .text(function(d) {
          //     return d;
          //   });

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
        console.log(fd);
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
      $scope.showUploadImage = false;
      $('#modifierProductModal').modal('show');
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
          $scope.pics = data.pics;
          console.log($scope.pics);
        }).error(function() {
          console.log('une erreur Mister');
        })
      } else {
        console.log('id introuvable');
      }
    };

    $scope.clearInputs = function() {
      // $scope.uploader.flow.files = [];
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
      var settings = {
        theme: 'ruby',
        sticky: true,
        horizontalEdge: 'top',
        verticalEdge: 'right',
        heading: 'Nouveau Profuit'
      };
      $.notific8('zindex', 11500);
      $.notific8(data.lastItem.name, settings);
      $scope.updateChart();
    });

    $scope.updateChart = function() {
      for (var i = 0; i < $scope.ListCategorieProduit.length; i++) {
        var counter = 0;
        for (var y = 0; y < $scope.listProduit.length; y++) {
          // console.log($scope.ListCategorieProduit[i]);
          // console.log($scope.listProduit[y].categorie)
          if ($scope.ListCategorieProduit[i].name === $scope.listProduit[y].categorie) {
            counter = counter + $scope.listProduit[y].amount;
            // console.log($scope.listProduit[y].amount);
          }
        }
        $scope.totalAmount = $scope.totalAmount + counter;
        $scope.barChart.push({
          categorie: $scope.ListCategorieProduit[i],
          amount: counter
        });
      }

      $("#barchartTest *").remove()
      $scope.productStockChart($scope.barChart);
    };

    $scope.productStockChart = function(data1) {
      var data = $scope.barChart;
      console.log(data);
      $scope.margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
      },
      $scope.width = 400,
      $scope.height = 500 - $scope.margin.top - $scope.margin.bottom;
      $scope.formatPercent = d3.format(".0");
      $scope.x = d3.scale.ordinal()
        .rangeRoundBands([0, $scope.width], .1);
      $scope.y = d3.scale.linear()
        .range([$scope.height, 0]);
      $scope.xAxis = d3.svg.axis()
        .scale($scope.x)
        .orient("bottom");
      $scope.yAxis = d3.svg.axis()
        .scale($scope.y)
        .orient("left")
        .tickFormat($scope.formatPercent);
      $scope.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Nombre de produit:</strong> <span style='color:red'>" + d.amount + "</span>";
        })
      $scope.svg = d3.select("#barchartTest").append("svg")
        .attr("width", $scope.width + $scope.margin.left + $scope.margin.right)
        .attr("height", $scope.height + $scope.margin.top + $scope.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + $scope.margin.left + "," + $scope.margin.top + ")");
      $scope.svg.call($scope.tip);

      // d3.data(jsonData, type, function(error, data) {
      $scope.x.domain($scope.barChart.map(function(d) {
        // console.log(d)
        console.log(d.categorie.name)
        return d.categorie.name;
      }));
      $scope.y.domain([0, d3.max($scope.barChart, function(d) {
        console.log(d.amount)
        return d.amount;
      })]);
      $scope.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + $scope.height + ")")
        .call($scope.xAxis);
      $scope.svg.append("g")
        .attr("class", "y axis")
        .call($scope.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("nombre Produit");
      $scope.svg.selectAll(".bar")
        .data($scope.barChart)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return $scope.x(d.categorie.name);
        })
        .attr("width", $scope.x.rangeBand())
        .attr("y", function(d) {
          return $scope.y(d.amount);
        })
        .attr("height", function(d) {
          return $scope.height - $scope.y(d.amount);
        })
        .on('mouseover', $scope.tip.show)
        .on('mouseout', $scope.tip.hide)
    }

    function type(d) {
      d.frequency = +d.amount;
      return d;
    }
  });