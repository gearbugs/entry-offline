'use strict';

angular.module('common').controller('PictureController', 
	['$scope', '$modalInstance', '$routeParams', 'parent', function ($scope, $modalInstance, $routeParams, parent) {
		$scope.systemPictures = [];
		$scope.uploadPictures = [];

	    $scope.main_menu = "entrybot_friends";
	    $scope.menu = "";

	    $scope.searchWord = '';

	    // 현재 선택한 탭
	    $scope.currentTab = 'system'; //for modal(sprite,upload,paint,character,text,etc)

	    $scope.selectedPictures = [];
	    $scope.selectedUpload = [];
	    $scope.currentIndex = 0;

		var calcInnerHeight = function() {
	        var height = $(".tab-right").height();
	        var rowCount = parseInt(height/148);
	        $scope.showCount = (rowCount+1)*6;
	    };

		$scope.init = function() {
	        $routeParams.type = 'default';
	        $routeParams.main = 'entrybot_friends';
	        $scope.collapse(1);
	        calcInnerHeight();

	        $scope.findPictures($routeParams.type, $routeParams.main, $routeParams.sub);
	    };


	    $scope.findPictures = function(type, main, sub) {

	        calcInnerHeight();

	        var url = '/api/picture/browse';
	        if (!type)
	            type = 'default';

	        url += ('/' + type);

	        if (main) {
	            $scope.main_menu = main;
	            url += ('/' + encodeURIComponent(main));
	            if (sub) {
	                $scope.menu = sub;
	                url += ('/' + encodeURIComponent(sub));
	            } else {
	                $scope.menu = '';
	            }
	        }

	        var data = [{"_id":"55c45ea28650a40b0088cfd8","filename":"a8268fd79a48fd9b92c7b47406b95393","name":"엔트리봇_걷기1","user":"5458c25ad9c27d816141f8d5","__v":0,"created":"2015-08-07T07:30:42.467Z","specials":[],"type":"_system_","dimension":{"width":284,"height":350},"category":{"main":"entrybot_friends"},"label":{"vn":"엔트리봇_걷기1","en":"엔트리봇_걷기1","ko":"엔트리봇_걷기1"}},{"_id":"55c45ea18650a40b0088cfd7","filename":"44cbd5953180e91751e82837bdff91ac","name":"엔트리봇_걷기2","user":"5458c25ad9c27d816141f8d5","__v":0,"created":"2015-08-07T07:30:41.643Z","specials":[],"type":"_system_","dimension":{"width":284,"height":350},"category":{"main":"entrybot_friends"},"label":{"vn":"엔트리봇_걷기2","en":"엔트리봇_걷기2","ko":"엔트리봇_걷기2"}},{"_id":"557fe7fd77e7209c349937a4","filename":"91299d08433dd918bb41d23ba991eb1c","name":"엔트리봇_옆모습","user":"53eef21dce8dd2c54f0cb721","__v":0,"created":"2015-06-16T09:10:21.411Z","specials":[],"type":"_system_","dimension":{"width":220,"height":350},"category":{"main":"entrybot_friends"},"label":{"vn":"엔트리봇_stand","en":"엔트리봇_stand","ko":"엔트리봇_stand"}},{"_id":"557fe7ea77e7209c3499379e","filename":"10cdf0111db739524011613efcde4a9c","name":"엔트리봇_정면","user":"53eef21dce8dd2c54f0cb721","__v":0,"created":"2015-06-16T09:10:02.038Z","specials":[],"type":"_system_","dimension":{"width":220,"height":350},"category":{"main":"entrybot_friends"},"label":{"vn":"엔트리봇_stand","en":"엔트리봇_stand","ko":"엔트리봇_stand"}}];
            $scope.systemPictures = [];
            for (var i in data) {
                var picture = data[i];
                picture.selected = 'boxOuter';
                for (var j in $scope.selectedPictures) {
                    if ($scope.selectedPictures[j]._id === picture._id) {
                        picture.selected = 'boxOuter selected';
                        break;
                    }
                }

                $scope.systemPictures.push(picture);
//                    console.log(picture.name + ' ' + picture.selected);
            }

	    };


	    $scope.search = function() {
	        calcInnerHeight();
	        $scope.searchWord = $('#searchWord').val();
	        if (!$scope.searchWord || $scope.searchWord == '') {
	            alert(Lang.Menus.searchword_required);
	            return false;
	        }

	        var url = '/api/picture/search/'+$scope.searchWord;
	        $http({method: 'GET', url: url}).
	            success(function(data,status) {
	                $scope.systemPictures = [];
	                for (var i in data) {
	                    var picture = data[i];
	                    picture.selected = 'boxOuter';
	                    for (var j in $scope.selectedPictures) {
	                        if ($scope.selectedPictures[j]._id === picture._id) {
	                            picture.selected = 'boxOuter selected';
	                            break;
	                        }
	                    }
	                    $scope.systemPictures.push(picture);
	                }
	                $scope.collapse(0);
	                $scope.main_menu = '';
	            }).
	            error(function(data, status) {
	                $scope.status = status;
	            });
	    };


	    $scope.upload = function() {
	        var uploadFile = document.getElementById("uploadFile").files;

	        if (!uploadFile || uploadFile.length === 0) {
	            alert(Lang.Menus.file_required);
	            return false;
	        }

	        if (uploadFile.length > 10) {
	            alert(Lang.Menus.file_upload_max_count);
	            return false;
	        }

	        for (var i=0, len=uploadFile.length; i<len; i++) {
	            var file = uploadFile[i];

	            var isImage = (/^image\//).test(file.type);
	            if (!isImage) {
	                alert(Lang.Menus.image_file_only);
	                return false;
	            }

	            if (file.size > 1024*1024*10) {
	                alert(Lang.Menus.file_upload_max_size);
	                return false;
	            }
	        }

	        $scope.$apply(function() {
	            $scope.isUploading = true;
	        });

	        var formData = new FormData();
	        formData.append("type", "user");
	        for (var i=0, len=uploadFile.length; i<len; i++) {
	            var file = uploadFile[i];
	            formData.append("uploadFile"+i, file);
	        }

	        $scope.uploadPictureFile(formData);
	    };

	    $scope.uploadPictureFile = function(formData) {
	        //console.log('picture.js:upload $.ajax called');
	        $.ajax({
	            url: '/api/picture/upload',
	            data: formData,
	            cache: false,
	            contentType: false,
	            processData: false,
	            type: 'POST',
	            success: function(data){
	                if (data && data.length > 0) {
	                    $scope.$apply(function() {
	                        $scope.isUploading = false;
	                        if (!$scope.uploadPictures)
	                            $scope.uploadPictures = [];

	                        data.forEach(function(item) {
	                            $scope.uploadPictures.push(item);
	                        });

	                    });
	                }
	            },
	            error: function() {
	                $scope.apply(function() {
	                    $scope.isUploading = false;
	                    alert(Lang.Msgs.error_occured);
	                });
	            }
	        });
	    };


	    $scope.collapse = function(dest) {
	        for (var i=1; i<=12; i++)
	            $scope['isCollapsed' + i] = true;

	        if (dest > 0) {
	            $scope['isCollapsed' + dest] = false;
	            $('#searchWord').val('');
	        }

	    };

        $scope.selectSystem = function(picture) {
	        var selected = true;
	        for (var i in $scope.selectedPictures) {
	            var item = $scope.selectedPictures[i];
	            if (item._id === picture._id) {
	                $scope.selectedPictures.splice(i,1);
	                selected = false;
	            }
	        }

	        if (selected) {
	            $scope.selectedPictures.push(picture);
	            // 스프라이트 다중 선택.
	            var elements = jQuery('.boxOuter').each(function() {
	                var element = jQuery(this);
	                if (element.attr('id') === picture._id) {
	                    element.attr('class', 'boxOuter selected');
	                }
	            });

	        } else {
	            var elements = jQuery('.boxOuter').each(function() {
	                var element = jQuery(this);
	                if (element.attr('id') === picture._id) {
	                    element.attr('class', 'boxOuter');
	                }
	            });
	        }

	    };
        $scope.applySystem = function(picture) {
	        $scope.selectedPictures = [];
	        $scope.selectedPictures.push(picture);

	        $modalInstance.close({
	            target: $scope.currentTab,
	            data: $scope.currentSelected()
	        });
	    };

	    $scope.selectUpload = function(picture) {
	        var selected = true;
	        for (var i in $scope.selectedUpload) {
	            var item = $scope.selectedUpload[i];
	            if (item._id === picture._id) {
	                $scope.selectedUpload.splice(i,1);
	                selected = false;
	            }
	        }

	        if (selected) {
	            $scope.selectedUpload.push(picture);
	            // 스프라이트 다중 선택.
	            var elements = jQuery('.boxOuter').each(function() {
	                var element = jQuery(this);
	                if (element.attr('id') === picture._id) {
	                    element.attr('class', 'boxOuter selected');
	                }
	            });
	        } else {
	            var elements = jQuery('.boxOuter').each(function() {
	                var element = jQuery(this);
	                if (element.attr('id') === picture._id) {
	                    element.attr('class', 'boxOuter');
	                }
	            });
	        }
	    };

	    $scope.tabs = [{title: 'Workspace.select_picture',
                    category: 'system',
                    partial: './views/modal/picture_library.html',
                    active: true},
                   {title: 'Workspace.upload',
                    category: 'upload',
                    partial: './views/modal/picture_upload.html'},
                   {title: 'Workspace.draw_new',
                    category: 'newPicture',
                    partial: './views/modal/picture_draw_new.html'}];


	    // 탭 이동
	    $scope.changeTab = function(tab) {
	        $scope.currentIndex = 0;
	        var mover = jQuery('.modal_selected_container_moving').eq(0);
	        mover.css('margin-left', 0);
	        $scope.currentTab = tab;
	    };

	    $scope.moveContainer = function (direction) {
	        if ($scope.selectedPictures.length <=5)
	            return;

	        var mover = jQuery('.modal_selected_container_moving').eq(0);
	        var pictures = $scope.selectedPictures;
	        if (direction == 'left') {
	            if ($scope.currentIndex+2 > pictures.length)
	                return;
	            $scope.currentIndex++;
	            mover.animate({
	                marginLeft: '-=106px',
	                duration: '0.2'
	            },function(){});
	        } else {
	            if ($scope.currentIndex-1 < 0)
	                return;
	            $scope.currentIndex--;
	            mover.animate({
	                marginLeft: '+=106px',
	                duration: '0.2'
	            },function(){});
	        }
	    }

	    $scope.currentSelected = function() {
	        if ($scope.currentTab === 'system') {
	            return $scope.selectedPictures;
	        } else if ($scope.currentTab === 'upload') {
	            return $scope.selectedUpload;
	        } else if ($scope.currentTab === 'textBox') {
	            return 'textBox';
	        } else {
	            return null;
	        }
	    };

	    $scope.showChoosen = function() {
	        if ($scope.currentTab == 'newPicture')
	            return false;
	        return true;
	    };


	    // 적용
	    $scope.ok = function () {
	        if (!$scope.currentSelected()) {
	            alert(Lang.Workspace.select_sprite);
	        } else {
	            $modalInstance.close({
	                target: $scope.currentTab,
	                data: $scope.currentSelected()
	            });
	        }
	    };

	    // 취소
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };

	    $scope.loadMore = function() {
	        if ($scope.showCount < $scope.systemPictures.length) {
	            $scope.showCount += 6; // append next one line
	        }
	    };
	}]);