/*
  author: Sean Winningham
  version: 0.0.5
  notes:
  1.
*/

//Preload audio
var filesLoaded = 0;

var chime = loadAudio('assets/cloth_flap01.mp3');
var windChime = loadAudio('assets/windchime_flourish09.mp3');
var cling = loadAudio('assets/claves.mp3');
var boing = loadAudio('assets/boing02.mp3');
var babyLaugh = loadAudio('assets/baby_boy_laugh_02.mp3');
var happyAlert = loadAudio('assets/happyalert.mp3');
var applause = loadAudio('assets/crowd_indoor_applause_01.mp3');

function loadAudio(uri)
{
    var audio = new Audio();
    audio.addEventListener('loadeddata', isAppLoaded, false);
    audio.src = uri;
    return audio;
}
 
function isAppLoaded()
{
    filesLoaded++;
	if (filesLoaded == 7) start();
}

var lesson = 9;
var activity = 64;

var continueFunction = 1;
var canClickDiamonds = false;
var diamondsPlaced = 0;
var currentDiamond; var diamondPadding;

var topPos = ['142px', '142px', '142px', '298px', '298px', '298px'];
var leftPos = ['30px', '190px', '350px', '30px', '190px', '350px'];
var quiltTopPos = ['78px', '139px', '197px', '256px', '316px'];
var quiltLeftPos = ['657px', '599px', '658px', '599px', '657px'];

var images = ['Baby-Sitting_up.png', 'baby-lying-down.png', 'baby-sour-face.png', 'Baby-food-interest.png', 'baby-sleeping.png', 'baby-interested-food.png'];
var reinforcements = [
'Correct! When your baby can sit up in a<br/>chair with minimal support he or she may be<br/>ready for solid foods.',
'If your baby is not able to sit up without assistance, he or she is not ready for solid foods. Please make another selection.',
'If your baby refuses solid foods, this may mean they are not ready. Give it some time. Please choose again.',
'Great Job! When fed, baby can move food from front to back of mouth and swallow.',
'Don\'t try and feed your baby solid foods when he or she is sleepy. Please make another selection.',
'Very good! Showing an interest in food is a sign that your baby may be ready for solids.'
];

$(document).ready(function(){
	//Hide
	$('#continue,#instructions,#baby,#quilt-fill').hide();
	
	//Give clickable diamonds backgrounds
	for(i=1;i<7;i++) {
		$('#diamond'+i).css('background', 'url(\'assets/'+images[i-1]+'\') no-repeat 100% 100% / 100% 100%');
	}
	
	//Continue Handler
	$('#continue').on('click', function(){
		$(this).hide();
		if(continueFunction == 1) {
			$('#instructions').html('');
			setTimeout(function(){
				canClickDiamonds = true;
				$('.diamond').css('cursor', 'pointer');
			},500)
		} else if (continueFunction == 2) {
			if($(currentDiamond).attr('name') == 'i') {
				$(currentDiamond).fadeOut(1000);
			}
			$('#instructions').css('color', '#222').html('Which babies are ready to eat solid foods?<br/>Select the 3 correct answers to create a baby quilt.');
			canClickDiamonds = true;
		} else if (continueFunction == 3) {
			babyAnimation();
		} else if (continueFunction == 4) {
			finishActivity();
		}
	});
	
	//Diamond Handler
	$('.diamond').on('click', function(){
		if(canClickDiamonds) {
			currentDiamond = $(this);
			canClickDiamonds = false;
			$(this).css('cursor', 'default');
			if($(this).attr('name') == 'c') {
				
				$(this).css('z-index', '3').animate({
					top:((119 * diamondsPlaced) + 78) + 'px',
					left:'539px',
					width:'120px',
					height:'120px',
					fontSize:'12px',
				},1500,'linear');
				diamondsPlaced++;
				setTimeout(function(){
					happyAlert.play();
					$('#instructions').css('color', '#669900').html(reinforcements[$(currentDiamond).attr('id').substr(7,1) - 1]);
					setTimeout(function(){
						if(diamondsPlaced == 3) {
							continueFunction = 3;
						} else {
							continueFunction = 2;
						}
						$('#continue').show();
					},2000);
				},500);
				
			} else {
				
				$(this).css('z-index', '3').animate({
					top:((119 * diamondsPlaced) + 78) + 'px',
					left:'539px',
					width:'120px',
					height:'120px',
					fontSize:'12px',
				},1500,'linear');
				setTimeout(function(){
					boing.play();
					$('#instructions').css('color', '#F24848').html(reinforcements[$(currentDiamond).attr('id').substr(7,1) - 1]);
					setTimeout(function(){
						continueFunction = 2;
						$('#continue').show();
					},2000);
				},2000);
				
			}
		}
	})
});

function start() {
	//Begin activity
	setTimeout(function(){
		diamondAnimation();
		setTimeout(function(){
			$('#tools1,#tools2').fadeIn();
			setTimeout(function(){
				windChime.play();
				$('#instructions').fadeIn(400);
			},500);
			setTimeout(function(){
				$('#instructions').html('Which babies are ready to eat solid foods?<br/>Select the 3 correct answers to create a baby quilt.');
				canClickDiamonds = true;
				$('.diamond').css('cursor', 'pointer');
			},2000);
		},5500);
	},100);
}

function diamondAnimation() {
	var counter = 1;
	var invl = setInterval(function(){
		$('#diamond'+counter).animate({
			top:topPos[counter-1],
			left:leftPos[counter-1],
			width:'150px',
			height:'150px',
			fontSize:'14px',
			opacity:'3'
		},1200);
		(counter > 6) ? clearInterval(invl) : counter++;
		if (counter == 2) chime.play();
	},400);
	setTimeout(function(){
		var counter2 = 1;
		var invl = setInterval(function(){
			$('#quilt'+counter2).animate({
				top:quiltTopPos[counter2-1],
				left:quiltLeftPos[counter2-1],
				opacity:'3'
			},1200);
			(counter2 > 5) ? clearInterval(invl) : counter2++;
		},400);
	},1500);
}

function babyAnimation() {
	$('div[name="i"],#instructions').fadeOut(400);
	setTimeout(function(){
		$('#tools1,#tools2').fadeOut();
		$('#quilt-fill').fadeIn(400);
		applause.play();
		$('#baby').show().animate({
			left:'222px',
			opacity:'3'
		},2000,'linear',function(){
			setTimeout(function(){
				// Move quilt over baby
				$('.quilt,div[name="c"],#quilt-fill').animate({
					left:'-=323px',
					top:'+=12px'
				},2000,'linear',function(){
					setTimeout(function(){
						$('#instructions')
							.css('color', '#222')
							.css('width', '230px')
							.css('top', '100px')
							.css('left', '215px')
							.html('Congratulations!')
							.fadeIn(400);
						setTimeout(function(){
							$('#instructions').html('Congratulations!<br/><br/>You selected all the correct responses<br/>and created a beautiful baby quilt.');
						},1500);
						setTimeout(function(){
							continueFunction = 4;
							$('#continue')
								.css('top', '220px')
								.css('left', '352px')
								.show();
							setTimeout(function(){
								finishActivity();
							},3000);
						},2500);
					},200);
				});
				setTimeout(function(){
					setTimeout(function(){
						babyLaugh.play();
					},1600);
					var invl = setInterval(function(){
						$('#baby').attr('src', 'assets/baby_2.png');
						setTimeout(function(){
							$('#baby').attr('src', 'assets/baby_1.png');
						},800);
					},1600);
				},400);
			},800);
		});
	},400);
}

function finishActivity() {
    var next = "";
    var lesson_complete = "";

    $.ajax({
        type: "POST",
        url: '/html/flash_finish_activity.cfm?lesson=' + lesson + '&activity=' + activity,
        success: function (data) {
            if (data) {
                lesson_complete = data.trim().substr(-1);

                if (lesson_complete == 1) {
                    next = "/html/lesson_summary.cfm";
                } else {
                    next = "/html/activities.cfm";
                }
            } else {
                next = "/html/lesson_list.cfm"
            }
 
 			document.forms.finish.activity.value = activity;
 			document.forms.finish.lesson.value = lesson;
 			document.forms.finish.target = "_top";
            document.forms.finish.action = next;
            document.forms.finish.submit();
        }
    })
}