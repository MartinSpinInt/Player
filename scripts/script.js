    var player = {};

    player.el  = {};

    //General var
    player.el.player            = document.querySelector( '.player' );
    player.el.video_full_screen = player.el.player.querySelector( '.video_full_screen' );
    player.el.video             = player.el.video_full_screen.querySelector( '.video video' );
    player.el.controls          = player.el.player .querySelector( '.controls' );
    player.el.informations      = player.el.player .querySelector( '.informations' );
    player.el.title             = player.el.informations .querySelector( '.title' );
    player.el.subtiles          = player.el.informations .querySelector( '.subtiles' );
    //Var toggle Play
    player.el.toggle_play       = player.el.controls.querySelector('.toggle_play');
    player.el.button_pause      = player.el.toggle_play.querySelector('.pause');
    player.el.button_play       = player.el.toggle_play.querySelector('.play');
    //Var timeline
    player.el.timeline          = player.el.player.querySelector('.timeline');
    player.el.progress_bar      = player.el.timeline.querySelector( '.progress_bar' );
    player.el.seek_bar          = player.el.timeline.querySelector( '.seek_bar' );
    player.el.progress_circle   = player.el.timeline.querySelector( '.progress_circle' );
    player.el.current_time      = player.el.timeline.querySelector( '.current_time' );
    player.el.duration_time      = player.el.timeline.querySelector( '.duration_time' );
    //Var video controls
    player.el.video_controls    = player.el.player.querySelector( '.video_controls' );
    player.el.full_screen       = player.el.video_controls.querySelector( '.full_screen' );
    player.el.volume_icon       = player.el.video_controls.querySelector( '.volume' );
    player.el.volume_bar        = player.el.video_controls.querySelector( '.volume_bar' );
    player.el.next              = player.el.video_controls.querySelector( '.next' );
    player.el.quality           = player.el.video_controls.querySelector( '.quality' );
    player.el.captions         = player.el.video_controls.querySelector( '.captions' );
    //Full Screen Controls
    player.el.progress_f_screen = player.el.video_full_screen.querySelector( '.progress_bar_full_screen' );
    player.el.controls_f_screen = player.el.video_full_screen.querySelector( '.controls_full_screen' );
    player.el.play_f_screen = player.el.video_full_screen.querySelector( '.play_full_screen' );
    player.el.pause_f_screen = player.el.video_full_screen.querySelector( '.pause_full_screen' );

    //Other var
    player.el.volume            = 0.7; //Set the volume default to 0.7
    player.el.timeout           = 0; 
    current_position            = 0; //X position to determinate draggable and user select 
    current_episode             = 0;  //First episode (for function next)
    count                       = 1;

    //JSON for list episodes
    var episodes = {
        "episode":[{
                "title":"Season 1 : Ep. 1 The Long Bright Dark",
                "src_hd":"src/videos/intro_truedetective_720p.mp4",
                "src_sd":"src/videos/intro_truedetective_144p.mp4",
                "subtiles":"yes"
            },
            {
                "title":"Season 1 : Ep. 2 Seeing Things",
                "src_hd":"src/videos/ep2_720p.mp4",
                "src_sd":"src/videos/ep2_360p.mp4",
                "subtiles":"no"
            }
        ]
    }




    function play_pause()
    {
        // Toggle play
        if( player.el.video.paused )
            player.el.video.play();

        else
            player.el.video.pause();
    };



    // Listen to click event on toggle play button

    player.el.toggle_play.addEventListener( 'click', function( event ){
        play_pause();
        // Prevent default event
        event.preventDefault();
    });



    // Listen to play event on video
    player.el.video.addEventListener( 'play', function(){
        // Update class
        player.el.player.classList.add( 'playing' );
        //change toggle play in play or pause bottom
        player.el.button_play.style.display='none';
        player.el.play_f_screen.style.display='none';
        player.el.button_pause.style.display='block';
        player.el.pause_f_screen.style.display='block';

    });

    // Listen to pause event on video
    player.el.video.addEventListener( 'pause', function(){
        // Update class
        player.el.player.classList.add( 'paused' );
        //change toggle play in play or pause bottom
        player.el.button_pause.style.display='none';
        player.el.pause_f_screen.style.display='none';
        player.el.button_play.style.display='block';
        player.el.play_f_screen.style.display='block';
    } );

    //Progress circle is draggable and change the current time plugin Interact.JS
    function progress_circle_draggable(){

    var element = player.el.progress_circle,
        parent_element = player.el.progress_bar;

    interact(element)
      .draggable({
        snap: {
          targets: [
            interact.createSnapGrid({ x: 1, y: 1 })
          ],
          relativePoints: [ { x: 0, y: 0 } ]
        },
        inertia: false,
        restrict: {
          restriction: parent_element,
          endOnly: false
        }
      })
      .on('dragmove', function (event) {
        current_position += event.dx;

    //Change current time when user draggable the circle  
        var progress_bar_width = player.el.progress_bar.offsetWidth, 
            progress_bar_left  = player.el.progress_bar.offsetLeft,
            ratio          = current_position / progress_bar_width,
            time           = ratio * player.el.video.duration;
        event.target.style.webkitTransform =
        event.target.style.transform =
             'translateX(' + ratio + 'px)';

          

        player.el.video.currentTime = time;

      });
    };
    progress_circle_draggable()


    //Change current time when user click and the progress bar 
    player.el.seek_bar.addEventListener( 'click', function( event ){
        // Calculate the time according to the mouse position
        var progress_bar_width = player.el.progress_bar.offsetWidth, 
            progress_bar_left  = player.el.progress_bar.offsetLeft,
            mouse_x        = event.clientX,
            position = mouse_x - progress_bar_left,
            ratio          = ( mouse_x - progress_bar_left ) / progress_bar_width,
            time           = ratio * player.el.video.duration;

        player.el.video.currentTime = time;

        current_position = position; 

        event.preventDefault();
    });

    //Current time in progress bar and change the css of full screen  
    window.setInterval( function(){
        var duration = player.el.video.duration,
            time     = player.el.video.currentTime,
            progress_bar_left  = player.el.progress_bar.offsetLeft,
            progress_bar_width = player.el.progress_bar.offsetWidth,
            position=((((time/duration) * 100)/100)*progress_bar_width)+progress_bar_left-7,
            pourcentage=(time/duration)*100;

        player.el.progress_bar.value = pourcentage;
        player.el.progress_circle.style.left= position;
        player.el.current_time.style.left= position-18 + 'px';
        player.el.progress_f_screen.value=pourcentage;


        //In full screen do 
        if(window.innerHeight != screen.height){
        player.el.progress_f_screen.style.display='none';
        player.el.controls_f_screen.style.display='none';

        } else {
           player.el.progress_f_screen.style.display='block'; 
           player.el.controls_f_screen.style.display='block'; 
        }
        
    }, 50 );


    //Update the duration and the current timer
    player.el.video.addEventListener( 'loadedmetadata', function()
    {
          var duration = player.el.video.duration,
          duration_minutes = Math.floor( duration / 60 ),
          duration_hour = Math.floor( duration_minutes / 60 ),
          duration_seconds = Math.floor( duration - duration_minutes * 60 );
                 
            if( duration_seconds < 10 )
                duration_seconds = '0' + duration_seconds;

            if( duration_minutes < 10 )
                duration_minutes = '0' + duration_minutes;

    player.el.duration_time.innerText = duration_hour + ':' + duration_minutes + ':' + duration_seconds;

        player.el.video.ontimeupdate = function()
        {
            var time = player.el.video.currentTime,
                current_minutes = Math.floor( time / 60 ),
                current_hour = Math.floor( current_minutes / 60 ),
                current_seconds = Math.floor( time - current_minutes * 60 );

            if( current_seconds < 10 )
                current_seconds = '0' + current_seconds;

            if( current_minutes < 10 )
                current_minutes = '0' + current_minutes;

            player.el.current_time.innerText = current_hour + ':' + current_minutes + ':' + current_seconds;
        };
    });

    //next episode
    player.el.next.addEventListener('click', function(){
    var sd_video = player.el.video.querySelector("source.active + source") || player.el.video.querySelector("source:first-child"),
        hd_video = video_currently = player.el.video.querySelector("source.active")
    if (current_episode < episodes.episode.length - 1) {
        current_episode++;
        player.el.title.innerText = episodes.episode[current_episode].title;
        hd_video.src = episodes.episode[current_episode].src_hd;
        sd_video.src = episodes.episode[current_episode].src_sd;
        player.el.video.src = episodes.episode[current_episode].src_hd;
        //desactive subtitles
        for (var i = 0; i < player.el.video.textTracks.length; i++) {
        player.el.video.textTracks[i].mode = 'hidden';
        player.el.captions.style.fill='#fff';
        }   
    }  else {
        alert ('come back later for another episode ;)');
    }      
    });


    //change the volume icon (full,half,mute)
    function volume_icon()
    {
    if ( player.el.volume == 0 ){
     player.el.volume_icon.querySelector('.volume_half').style.opacity=0;
     player.el.volume_icon.querySelector('.volume_full').style.opacity=0;
     player.el.video_controls.querySelector( '.volume_mute' ).style.opacity=1;

    } 
    else if (player.el.volume < 0.5) {
     player.el.volume_icon.querySelector('.volume_half').style.opacity=1;
     player.el.volume_icon.querySelector('.volume_full').style.opacity=0;
     player.el.video_controls.querySelector( '.volume_mute' ).style.opacity=0;
    }
    else if (player.el.volume > 0.5){
     player.el.volume_icon.querySelector('.volume_half').style.opacity=0;
     player.el.volume_icon.querySelector('.volume_full').style.opacity=1;
     player.el.video_controls.querySelector( '.volume_mute' ).style.opacity=0;

    }
    };
    volume_icon(); 


    //Change volume + update CSS and var volume
    player.el.volume_bar.addEventListener( 'click', function(){
        var volume_bar_width = player.el.volume_bar.offsetWidth, 
            volume_bar_left  = player.el.volume_bar.offsetLeft ,
            mouse_x        = event.clientX,
            ratio          = ((mouse_x - volume_bar_left) / volume_bar_width)-12.9,
            volume           = Math.round(ratio * 10) / 10 ;

        player.el.video.volume = volume;
        player.el.volume_bar.value=volume;


       
        player.el.volume = volume;

    volume_icon();
    });


    //Change volume on click icon and update var volume vidéo
    player.el.volume_icon.addEventListener( 'click', function(){
        
    if ( player.el.volume > 0 ){
        player.el.video.volume=0;
        player.el.volume = 0;
     } 
     else {
        player.el.video.volume=0.7;
        player.el.volume = 0.7;
    }

        player.el.volume_bar.value=player.el.volume;
        volume_icon();
    });

    //Change quality 
    player.el.quality.addEventListener('click', function(){
         var time            = player.el.video.currentTime,
             video_currently = player.el.video.querySelector("source.active"),
             next_video      = player.el.video.querySelector("source.active + source") || player.el.video.querySelector("source:first-child");

        video_currently.className = "";
        next_video.className = "active";

        player.el.video.src = next_video.src;
        player.el.video.currentTime=time;

        if(player.el.video.querySelector("source:first-child").className == 'active'){
            player.el.quality.innerText='720p';
        } else {
            player.el.quality.innerText='144p';
        }

    play_pause();
    });

    player.el.captions.addEventListener('click',function(){
         count++;
      if(episodes.episode[current_episode].subtiles === 'yes'){
            for (var i = 0; i < player.el.video.textTracks.length; i++) 
            {
                if (count%2 == 0) {
                    player.el.video.textTracks[i].mode = 'showing';
                    player.el.captions.style.fill='#ff2a00';
                } else {
                    player.el.video.textTracks[i].mode = 'hidden';
                    player.el.captions.style.fill='#fff';
                }  
            } 
        } else {
            alert('no subtiles for this vidéo, sorry');
        }
        
    });

    //enter full screen
    function enter_full_screen()
    {

            if( player.el.video_full_screen.requestFullscreen ){
                player.el.video_full_screen.requestFullscreen();
            } 
       else if( player.el.video_full_screen.mozRequestFullScreen ){
                player.el.video_full_screen.mozRequestFullScreen();
            }
       else if( player.el.video_full_screen.webkitRequestFullscreen ){
                player.el.video_full_screen.webkitRequestFullscreen();
      
        }
    };
    //exit full screen
    function exit_full_screen()
        {
            if( document.exitFullscreen ){
                document.exitFullscreen();

            }

            else if( document.mozCancelFullScreen ){
                document.mozCancelFullScreen(); 
            }

            else if( document.webkitExitFullscreen ){
                document.webkitExitFullscreen(); 
            }
        };


    //full screen 
    player.el.full_screen.addEventListener( 'click', function()
    {

        if( window.innerHeight != screen.height) {
            enter_full_screen();
        } 
    });

    //double click for full screen
    player.el.video.addEventListener('dblclick', function (){
        if( window.innerHeight != screen.height) {
            enter_full_screen();     
        } else {
          exit_full_screen();   
        }
    });

    //Change current time in full screen when user click and the progress bar 
    player.el.progress_f_screen.addEventListener( 'click', function( event ){
        // Calculate the time according to the mouse position
        var progress_bar_width = player.el.progress_f_screen.offsetWidth, 
            progress_bar_left  = player.el.progress_f_screen.offsetLeft,
            mouse_x        = event.clientX,
            ratio          = ( mouse_x - progress_bar_left ) / progress_bar_width,
            time           = ratio * player.el.video.duration;

        player.el.video.currentTime = time;

        event.preventDefault();
    });



    // Hide controls when user don't move mouse
    player.el.player.addEventListener( 'mousemove', function()
    {
       player.el.controls.style.opacity = 1;
       player.el.progress_f_screen.style.opacity=1;
       player.el.controls_f_screen.style.opacity=1;
       player.el.informations.style.opacity=1;
        clearTimeout(player.el.timeout);
        player.el.timeout = setTimeout( function()
        {
            player.el.controls.style.opacity = 0;
             player.el.progress_f_screen.style.opacity=0;
            player.el.controls_f_screen.style.opacity=0;
            player.el.informations.style.opacity=0;
        }, 3000 );
    } );



    //keyboard shortcuts for player
    document.addEventListener( 'keydown', function( event )
    {

    var charCode = event.charCode || event.keyCode || event.which;
    event.preventDefault()

            if( charCode == '32' ){
                play_pause();
            }
    });




