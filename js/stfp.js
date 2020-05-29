/*jslint nomen: true, vars: true */
/*jshint scripturl: true, -W079 */
/*global yad: true, window: true, alert: true, jQuery: true, $: true*/

// This script is part of STFP
// Copyright (c) 2013 Matthias Ladkau

if (stfp === undefined) {
    var stfp = {};
}

stfp.SCREEN_ID     = "screen";
stfp.MINIMAP_ID    = "minimap";
stfp.DEBUG_ID      = "debug";
stfp.SCREEN_WIDTH  = 640;
stfp.SCREEN_HEIGHT = 480;
stfp.DEBUG         = false;

// Sprite lookup
stfp.sprites = {};

// Quick lookup for player
// Note: This object does not have the current position
//       use the state in the controller for this.
stfp.player = undefined;

// Stats
stfp.stats = {
    latest_map  : 1,
    panda_kills : 0,
    nazi_kills  : 0,
    balas : 9999,
    start_time  : undefined
};


function nivelEnBinario (nivel) {
    switch (nivel) {
        case 1: return "0";
        case 2: return "1";
        case 3: return "10";
        case 4: return "11";
        case 5: return "100";
    }
};

stfp.main = {

    init : function () {
        "use strict"

        if (stfp.main._screenInit === undefined) {
            var screen = ge.$(stfp.SCREEN_ID ),
                height = window.innerHeight - 20;
            screen.width  = stfp.SCREEN_WIDTH;
            screen.height = stfp.SCREEN_HEIGHT;
            screen.style.width  = (height * 4 / 3) + "px";
            screen.style.height = height + "px";
            stfp.main._screenInit = true;
        }

        stfp.main.showIntro();
    },

    showIntro : function () {
        "use strict"

        var ctx  = stfp.main._showText("", "white", true, "black", 50),
            text = "Presiona ENTER para continuar ...",
            tw = ctx.measureText(text).width,
            image = new Image(),
            image2 = new Image(),
            ix, iw, iscale;

        // Reset all ids
        ge.$(stfp.DEBUG_ID).innerHTML = "";
        ge.$(stfp.SCREEN_ID).innerHTML = "";
        ge.$(stfp.MINIMAP_ID).innerHTML = "";

        image2.onload = function () {
            ctx.drawImage(image2, -1, 0)
        };
        image2.src = "img/liz_antonella.png";


        image.onload = function () {
            iscale = Math.floor(stfp.SCREEN_WIDTH / 2);
            ix = (stfp.SCREEN_WIDTH - iscale) / 2;
            iw = iscale;

            /*
            ctx.drawImage(image, 0, 0, 64, 64,
                          ix , 70 - Math.floor(iscale * 0.15),
                          iw, iw);
            */

            ctx.drawImage(image, ix, 70 - Math.floor(iscale * 0.15));


            ctx.fillText(text, stfp.SCREEN_WIDTH / 2 - tw / 2, stfp.SCREEN_HEIGHT - 50);

            document.onkeydown = ge.bind(function (e) {
                e = e || window.event;
                if (e.keyCode === 13) {
                    document.onkeydown = null;
                    stfp.main.seleccionNivel(1);
                }
            });
        };
        image.src = "img/titulo.png";
    },


    seleccionNivel : function (indice) {
        "use strict";

        var ctx  = stfp.main._showText("Nivel de dificultad", "pink", true, "black", 50),
            text = "Presiona ENTER para continuar ...",
            tw = ctx.measureText(text).width,
            image1 = new Image(),
            image2 = new Image(),
            image3 = new Image(),
            image4 = new Image(),
            ix, iw, iscale, siguiente = 0;

        ctx.fillText(text, stfp.SCREEN_WIDTH / 2 - tw / 2, stfp.SCREEN_HEIGHT - 50);

        image1.src = (indice==1)?"img/liz1.png":"img/liz1_desactivado.png";
        image1.onload = function () {
            ctx.drawImage(image1, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.05), 80, 64, 64);
        }


        image2.src = (indice==2)?"img/liz2.png":"img/liz2_desactivado.png";
        image2.onload = function () {
            ctx.drawImage(image2, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.05), 160, 64, 64);
        };


        image3.src = (indice==3)?"img/liz3.png":"img/liz3_desactivado.png";
        image3.onload = function () {
            ctx.drawImage(image3, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.05), 240, 64, 64);
        };

        image4.src = (indice==4)?"img/liz4.png":"img/liz4_desactivado.png";
        image4.onload = function () {
            ctx.drawImage(image4, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.05), 320, 64, 64);
        };


        ctx.fillStyle = indice==1?"purple":"gray";
        text = "Bebé de la casa";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.2), 120);

        ctx.fillStyle = indice==2?"purple":"gray";
        text = "Quiere ser dark pero su mamá no le deja";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.2), 200);

        ctx.fillStyle = indice==3?"purple":"gray";
        text = "Sos arte";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.2), 280);

        ctx.fillStyle = indice==4?"purple":"gray";
        text = "Diosa inalcanzable";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.2), 360);

        document.onkeydown = ge.bind(function (e) {
            e = e || window.event;
            //if (e.keyCode === 13) {
            //    document.onkeydown = null;
            //    stfp.main.showInstructions();
            //}

            switch (e.keyCode) {
                case 38: // arriba
                    siguiente = (indice==1)?4:(indice-1);
                    document.onkeydown = null;
                    stfp.main.seleccionNivel(siguiente);
                    break;
                case 40: // abajo
                    siguiente = (indice==4)?1:(indice+1);
                    document.onkeydown = null;
                    stfp.main.seleccionNivel(siguiente);
                    break;
                case 13: //enter
                    document.onkeydown = null;
                    stfp.main.showInstructions();
                    break;
            }




        });
    },




    showInstructions : function () {
        "use strict";

        var ctx  = stfp.main._showText("Controles", "pink", true, "black", 50),
            text = "Presiona ENTER para continuar ...",
            tw = ctx.measureText(text).width,
            image = new Image(),
            image2 = new Image(),
            ix, iw, iscale;

        ctx.fillText(text, stfp.SCREEN_WIDTH / 2 - tw / 2, stfp.SCREEN_HEIGHT - 50);

        image.src = "img/covid19.png";
        image.onload = function () {
            ctx.drawImage(image, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.2), 80, 64, 64);
        }

        image2 = new Image();
        image2.src = "img/hitler.png";
        image2.onload = function () {
            ctx.drawImage(image2, 0, 0, 64, 64,
                          Math.floor(stfp.SCREEN_WIDTH * 0.2), 160, 64, 64);
        };

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "red";
        text = "<Flechas>";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.27) - ctx.measureText(text).width, 270);
        text = "<Espacio>";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.27) - ctx.measureText(text).width, 310);
        text = "<ENTER>";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.27) - ctx.measureText(text).width, 350);

        ctx.fillStyle = "black";
        text = "Disparale a los virus ...";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.33), 120);
        text = "... y a los onvres";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.33), 200);
        text = "moverse";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.33), 270);
        text = "disparar";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.33), 310);
        text = "pausa";
        ctx.fillText(text, Math.floor(stfp.SCREEN_WIDTH * 0.33), 350);

        document.onkeydown = ge.bind(function (e) {
            e = e || window.event;
            if (e.keyCode === 13) {
                document.onkeydown = null;
                stfp.main.initEngine();
            }
        });
    },

    initEngine : function () {
        "use strict"

        // Reset all ids
        ge.$(stfp.DEBUG_ID).innerHTML = "";
        ge.$(stfp.SCREEN_ID).innerHTML = "";
        ge.$(stfp.MINIMAP_ID).innerHTML = "";

        if (stfp.scene["map" + stfp.stats.latest_map] === undefined) {
            // No more maps available - end the game
            stfp.main.gameFinished();
            return;
        }

        stfp.main._showText("Nivel " + nivelEnBinario(stfp.stats.latest_map)  + " - Listo", "blue", true);

        stfp.main._playSound("snd/get_ready.ogg");

        window.setTimeout(function () {
            stfp.main.start();
        }, 3000);
    },

    start : function () {
        "use strict";

        if (stfp.stats.start_time === undefined) {
            stfp.stats.start_time = new Date().getTime();
        }

        stfp.player = new stfp.Player();

        var height = window.innerHeight - 20,
            controller = new ge.MainController(stfp.SCREEN_ID, stfp.MINIMAP_ID, {
                screenWidth         : stfp.SCREEN_WIDTH,
                screenHeight        : stfp.SCREEN_HEIGHT,
                screenElementWidth  : height * 4 / 3,
                screenElementHeight : height,
                wallTextureAtlas    : "img/walls.png",
                wallTextureMapping  : {
                    "2" : [0, 64], // x and y offset on texture atlas
                    "3" : [0, 128],
                    "4" : [0, 192],
                    "5" : [64, 0],
                    "6" : [64, 128],
                    "7" : [64, 192],
                    "8" : [128, 128],
                    "9" : [128, 192],                    
                    "10" : [128, 0],
                    "11" : [192, 0],
                    "12" : [128, 64],
                    "13" : [192, 64],
                    "14" : [192, 192]
                },
                ceilingSolidColor     : "#223322",
                floorSolidColor       : "#AAAAAA",
                drawHandler           : ge.bind(stfp.player.draw, stfp.player),
                eventHandler          : stfp.player
            }, stfp.DEBUG ? stfp.DEBUG_ID : undefined);

        // Make sure player has reference to controller
        stfp.player._controller = controller;
        stfp.main.controller = controller;

        // Load the correct map
        var scene = stfp.scene["map" + stfp.stats.latest_map];


        // Agregar a los enemigos
        for (var i=0;i<scene.pandas.length;i++) {
            var panda = scene.pandas[i];
            for (var j=0;j<panda[0];j++) {
                var id = "panda"+i+"-"+j;
                stfp.sprites[id] = new stfp.Panda(id, panda[1], panda[2], controller);
            }
        }

        for (i=0;i<scene.hitlers.length;i++) {
            var hitler = scene.hitlers[i],
                id = "hitler"+i;

            stfp.sprites[id] = new stfp.Hitler(id, hitler[0], hitler[1], controller);
        }

        for (i=0;i<scene.nazies.length;i++) {
            var nazi = scene.nazies[i],
                id = "nazi"+i;

            stfp.sprites[id] = new stfp.Nazi(id, nazi[0], nazi[1], controller);
        }

        for (i=0;i<scene.machos0.length;i++) {
            var macho0 = scene.machos0[i],
                id = "macho0"+i;

            stfp.sprites[id] = new stfp.Macho0(id, macho0[0], macho0[1], controller);
        }

        for (i=0;i<scene.machos1.length;i++) {
            var macho1 = scene.machos1[i],
                id = "macho1"+i;

            stfp.sprites[id] = new stfp.Macho1(id, macho1[0], macho1[1], controller);
        }

        for (i=0;i<scene.machos2.length;i++) {
            var macho2 = scene.machos2[i],
                id = "macho2"+i;

            stfp.sprites[id] = new stfp.Macho2(id, macho2[0], macho2[1], controller);
        }

        controller.start(scene.map, {
            x : 1.5,
            y : 1.5
        });
    },

    checkWin : function () {
        "use strict";

        for (var id in stfp.sprites) {
            var sprite = stfp.sprites[id];
            if (!sprite.isDead()) {
                return;
            }
        }

        // Stop the game
        window.setTimeout(function () {
            stfp.main.controller.stop();
        }, 200);
        window.setTimeout(stfp.main.stageCleared, 500);
    },

    stageCleared : function () {

        stfp.main._showText("Nivel terminado", "green");

        window.setTimeout(function () {
            stfp.sprites = {};

            // Carry the health over to the next level
            //stfp.Player.initial_health = stfp.player.health;
            stfp.Player.initial_health = 100;

            stfp.stats.latest_map++;

            stfp.player = undefined;
            stfp.main.initEngine();
        }, 2000);
    },

    gameOver : function () {
        "use strict";

        // Stop the game
        stfp.main.controller.stop();

        stfp.main._showText("Game Over", "red");

        stfp.main._playSound("snd/stfp_game_over.ogg");

        window.setTimeout(stfp.main._showStats, 3000);
    },

    gameFinished : function () {
        "use strict";

        // Stop the game
        stfp.main.controller.stop();

        stfp.main._showText("Juego completado!", "cyan", true);
        confirm("Felicidades, ganaste!\nQue guapa!\n¿Querés ser mi novia?");

        stfp.main._playSound("snd/stfp_finish.ogg");

        window.setTimeout(stfp.main._showStats, 3000);
    },


    _showText : function (text, background, solid, foreground, yPos) {
        "use strict";
        var screen = ge.$(stfp.SCREEN_ID),
            ctx    = screen.getContext("2d"),
            tw, text, y;

        if (solid !== true) {
            ctx.globalAlpha=0.7;
        }
        ctx.fillStyle=background;
        ctx.fillRect(0, 0, stfp.SCREEN_WIDTH, stfp.SCREEN_HEIGHT);
        ctx.globalAlpha=1;

        ctx.fillStyle = foreground === undefined ? "white" : foreground;
        ctx.font = "bold 24px Arial";
        tw = ctx.measureText(text).width;
        y = yPos === undefined ? stfp.SCREEN_HEIGHT / 2 - 12 : yPos;
        ctx.fillText(text, stfp.SCREEN_WIDTH / 2 - tw / 2, y);

        return ctx;
    },

    _showStats : function () {
        "use strict";
        var timeDelta = new Date().getTime() - stfp.stats.start_time;
        alert("Coronavirus: "+ stfp.stats.panda_kills +
              "\nOnvres: " + stfp.stats.nazi_kills +
              "\nTiempo: " + stfp.main.timeString(Math.floor(timeDelta / 1000)));

        // Reset stats
        stfp.stats = {
            latest_map  : 1,
            panda_kills : 0,
            nazi_kills  : 0,
            balas       : 9999,
            start_time  : undefined
        };
        stfp.Player.initial_health = 100;

        stfp.main.showIntro();
    },

    _playSound : function (sound) {
        var audio = new Audio();
        audio.src = sound;
        audio.play();
    },

    timeString : function (seconds) {
        "use strict";
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600),
            numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60),
            numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        return  (numhours < 10 ? "0" : "") + numhours + ":" +
                (numminutes < 10 ? "0" : "") + numminutes + ":" +
                (numseconds < 10 ? "0" : "") + numseconds;
    }
};

stfp.Player = ge.Class.create(ge.default_eventHandler, {

    init : function () {
        "use strict";
        this._gunSprite = new Image();
        this._gunSprite.src = "img/gun.png";

        //agreagado para la barra de status
        this._statusbar = new Image();
        this._statusbar.src = "img/statusbar.png";

        // Two sounds to cope with the case if the player
        // fires again before the sound finished
        this._gunSound1 = new Audio();
        this._gunSound1.src = "snd/shot.ogg";
        this._gunSound2 = new Audio();
        this._gunSound2.src = "snd/shot.ogg";

        this._animationOffset = 0;

        this._screenMiddle = stfp.SCREEN_WIDTH / 2;
        this._killZoneStart = this._screenMiddle - 25;
        this._killZoneEnd = this._screenMiddle + 25;

        // Player health
        this.health = stfp.Player.initial_health;

        // Make sure this object is bound to onkeydown
        this.onkeydown = ge.bind(this.onkeydown, this);
    },

    // Draw function which is called by the engine
    //
draw : function (ctx, state, sprites) {
        "use strict";

        // Draw health
        //if (this.health > 75) { ctx.fillStyle = "green"; }
        //else if (this.health > 40) { ctx.fillStyle = "yellow"; }
        //else { ctx.fillStyle = "red"; }
        //ctx.font = "bold 24px Arial";
        //ctx.fillText("\u2764 " + this.health, stfp.SCREEN_WIDTH - 75, 25);

        // Draw the gun with the current animation offset
        ctx.drawImage(this._gunSprite,
                      // Which part of the texture should be drawn
                      this._animationOffset,
                      // Vertical offset on texture image
                      0,
                      // Texture width
                      stfp.AnimatedSprite.FRAME_WIDTH,
                      64, // Texture height (default)
                      // Horizontal position
                      stfp.Player.GUN_POS_X,
                      // Vertical position
                      stfp.Player.GUN_POS_Y - 64, //modificado
                      stfp.AnimatedSprite.FRAME_WIDTH * stfp.Player.GUN_SCALE,
                      64 * stfp.Player.GUN_SCALE);

        // Dibujar barra de estado
        ctx.drawImage(this._statusbar, 0, 416);

        // Draw health
        ctx.fillStyle = "green"; 

        ctx.font = "bold 24px Arial";
        ctx.fillText(this.health + "%", 365, 470); //salud
        ctx.fillText( nivelEnBinario(stfp.stats.latest_map), 30, 470);  //nivel      
        ctx.fillText((stfp.stats.nazi_kills*100) + (stfp.stats.panda_kills*50), 120, 470);    //puntos
        ctx.fillText(1, 230, 470); //vidas
        ctx.fillText(stfp.stats.balas, 470, 470); //balas

        if (this._shotFrom !== undefined) {
            // Confirm that we are still seeing the shooting sprite
            for (var i=sprites.length-1; i >= 0; i--) {
                if (sprites[i].id === this._shotFrom.id) {

                    // Calculate distance
                    var vx = sprites[i].x - state.player.x,
                        vy = sprites[i].y - state.player.y,
                        distance = Math.sqrt(vx*vx+vy*vy);

                    // Formular to decide if the player was hit
                    if (Math.ceil(Math.random()*distance) > distance / 3) {
                        var hit = Math.floor(200 / distance);
                        if (this.health <= hit) {
                            this.kill(ctx);
                            return;
                        }
                        this.health -= hit;
                        this._ouch = 10;
                    }
                }
            }
            this._shotFrom = undefined;
        }

        if (this._ouch !== undefined) {
            ctx.globalAlpha=0.2;
            ctx.fillStyle="red";
            ctx.fillRect(0, 0, stfp.SCREEN_WIDTH, stfp.SCREEN_HEIGHT);
            ctx.globalAlpha=1;
            this._ouch = this._ouch === 0 ? undefined : this._ouch - 1;
        }

        if (stfp.DEBUG) {
            ctx.strokeRect(this._killZoneStart, 0, this._killZoneEnd - this._killZoneStart, stfp.SCREEN_HEIGHT);
        }

        // Check if we should do hit detection
        if (this._firing) {

            // Go through each sprite and check if we have a hit
            for (var i=sprites.length-1; i >= 0; i--) {

                var sprite = sprites[i];

                if (sprite.hitList.length > 0) {
                    // We hit the sprite - now check if the aim was good enough ...

                    var x1 = sprite.hitList[0][2];
                    var x2 = x1 + sprite.hitList[0][3];
                    if ((x1 <= this._killZoneEnd && x2 >= this._killZoneEnd) ||
                        (x1 <= this._killZoneStart && x2 >= this._killZoneStart)) {

                        if (!stfp.sprites[sprite.id].isDead()) {
                            // We hit the sprite in the killzone
                            stfp.sprites[sprite.id].kill();
                            // The firing had its effect - no other effects possible
                            this._firing = false;
                            break;
                        }
                    }

                    if (stfp.DEBUG) {
                        ctx.strokeRect(x1, 0, x2 - x1 ,stfp.SCREEN_HEIGHT);
                    }
                }
            }
        }
    },

    fire : function (state) {
        "use strict";

        if (this._fireInProgress === true) {
            return;
        }
        this._fireInProgress = true;

        var fireLoop = ge.bind(function () {
            this._animationOffset += stfp.AnimatedSprite.FRAME_WIDTH;

            if (this._animationOffset > 64 && this._animationOffset < 192) {
                if (this._firing === undefined) {
                    this._firing = true;
                }
            } else {
                this._firing = undefined;
            }

            if (this._animationOffset <= 320) {
                window.setTimeout(fireLoop, 80);
            } else {
                this._animationOffset = 0;

                // Wait a bit before we can refire
                window.setTimeout(ge.bind(function () {
                    this._animationOffset = 0;
                    this._fireInProgress = undefined;
                }, this), 80);
            }
        }, this);

        if (this._gunSound1.paused) {
            if (window.chrome) this._gunSound1.load()
            this._gunSound1.play();
        } else {
            if (window.chrome) this._gunSound2.load()
            this._gunSound2.play();
        }

        stfp.stats.balas--;
        fireLoop();
    },

    // Key handler for fireing
    //
    onkeydown : function (state, e) {
        "use strict";

        e = e || window.event;
        switch (e.keyCode) {
            case 32: // Space
            case 89: // y
            case 90: // z
                this.fire(state);
            break;
            case 13:
                alert("Pausa");
            break;
        }

        this._super(state, e);
    },

    // Player was shot at
    //
    // sprite - Sprite which is shooting at the player
    //
    hit : function (sprite) {
        "use strict";
        this._shotFrom = sprite;
    },

    // Player was killed
    //
    kill : function (ctx) {
        "use strict";
        stfp.main.gameOver();
    }
});
stfp.Player.GUN_SCALE = 4;
stfp.Player.GUN_POS_X = Math.floor(stfp.SCREEN_WIDTH * 0.6);
stfp.Player.GUN_POS_Y = stfp.SCREEN_HEIGHT - 64 * stfp.Player.GUN_SCALE;
stfp.Player.initial_health = 100;

stfp.Panda = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this._dead = false;
        this._deadSound = new Audio();
        this._deadSound.src = "snd/koronavairus.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/covid19.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "pink",
            spriteScaleX    : 0.5,
            spriteScaleY    : 0.5,
            spriteOffsetX   : 0,
            speed           : 1
        };
        controller.addSprite(this._state);

        this.runAnimation(0, 256, {
            speed     : 200,
            oscillate : true
        });

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        this._state.rot = Math.floor((Math.random() * Math.PI * 2));

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },

    // Panda died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        this.runAnimation(384, 576, {
            speed     : 80,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 512;
        }, this));

        // Adjust stats
        stfp.stats.panda_kills++;

        stfp.main.checkWin();
    }
});


stfp.Nazi = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this.id = id;
        this._dead = false;
        this._shoot = undefined;
        this._playerAware = false;
        this._playerSeenSound = new Audio();
        this._playerSeenSound.src = "snd/achtung.ogg";
        this._deadSound = new Audio();
        this._deadSound.src = "snd/mi_abuelo_murio.ogg";
        this._shotSound = new Audio();
        this._shotSound.src = "snd/guard_shot.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/guard.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "red",
            spriteOffsetX   : 0,
            speed           : 0
        };
        controller.addSprite(this._state);

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        var playerSeen = this._state.hitList.length !== 0;

        if (!this._playerAware && !playerSeen) {
            // Do nothing if we don't see the player and we are not aware of him
            this._state.speed = 0;
            return;
        }
        if (this._playerAware === false) {
            // We see the player for the first time
            this._playerSeenSound.play();
            this._playerAware = true;

            // NOTE: Activate this for extra difficulty
            // this._shoot = true;
        }

        // Calculate vector on the player
        var vp_x = this._controller._state.player.x-this._state.x,
            vp_y = this._controller._state.player.y-this._state.y;

        // Calculate angle phi on the player
        this._state.rot = Math.atan2(vp_y, vp_x);

        if (!playerSeen || this._shoot === undefined) {
            this._state.speed = 0.5;
            this.runAnimation(64, 256, {
                speed     : 150,
                oscillate : false
            });
            this._shoot = true;

        } else {
            // We see the player and we can shoot

            // We need to stop
            this._state.speed = 0;

            window.setTimeout(ge.bind(function (oldx, oldy) {
                var vp_x = oldx - this._controller._state.player.x,
                    vp_y = oldy - this._controller._state.player.y,
                    move_dist = Math.sqrt(vp_x * vp_x + vp_y * vp_y);

                this._shotSound.play();

                // If the player didn't move while the enemy is shooting he was "shot at"
                if (move_dist < 0.5) {
                    // During the shoot animation tell the player that he was shot at.
                    // Player object decides if it was hit.
                    stfp.player.hit(this);
                }
            }, this, this._controller._state.player.x, this._controller._state.player.y),
            450);

            // Run the shoot animation
            this.runAnimation(704, 832, {
                speed     : 250,
                singlerun : true
            }, ge.bind(function () {
                this._state.spriteOffsetX = 0;
            }, this));

            this._shoot = undefined;
        }

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },


    // Nazi died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        // Adjust stats
        stfp.stats.nazi_kills++;

        this.runAnimation(256, 510, {
            speed     : 150,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 640;
        }, this));

        stfp.main.checkWin();
    }
});



stfp.Macho0 = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this.id = id;
        this._dead = false;
        this._shoot = undefined;
        this._playerAware = false;
        this._playerSeenSound = new Audio();
        this._playerSeenSound.src = "snd/achtung.ogg";
        this._deadSound = new Audio();
        this._deadSound.src = "snd/guard_dead.ogg";
        this._shotSound = new Audio();
        this._shotSound.src = "snd/guard_shot.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/macho0.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "red",
            spriteOffsetX   : 0,
            speed           : 0
        };
        controller.addSprite(this._state);

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        var playerSeen = this._state.hitList.length !== 0;

        if (!this._playerAware && !playerSeen) {
            // Do nothing if we don't see the player and we are not aware of him
            this._state.speed = 0;
            return;
        }
        if (this._playerAware === false) {
            // We see the player for the first time
            this._playerSeenSound.play();
            this._playerAware = true;

            // NOTE: Activate this for extra difficulty
            // this._shoot = true;
        }

        // Calculate vector on the player
        var vp_x = this._controller._state.player.x-this._state.x,
            vp_y = this._controller._state.player.y-this._state.y;

        // Calculate angle phi on the player
        this._state.rot = Math.atan2(vp_y, vp_x);

        if (!playerSeen || this._shoot === undefined) {
            this._state.speed = 0.5;
            this.runAnimation(0, 256, {
                speed     : 150,
                oscillate : false
            });
            this._shoot = true;

        } else {
            // We see the player and we can shoot

            // We need to stop
            this._state.speed = 0;

            window.setTimeout(ge.bind(function (oldx, oldy) {
                var vp_x = oldx - this._controller._state.player.x,
                    vp_y = oldy - this._controller._state.player.y,
                    move_dist = Math.sqrt(vp_x * vp_x + vp_y * vp_y);

                this._shotSound.play();

                // If the player didn't move while the enemy is shooting he was "shot at"
                if (move_dist < 0.5) {
                    // During the shoot animation tell the player that he was shot at.
                    // Player object decides if it was hit.
                    stfp.player.hit(this);
                }
            }, this, this._controller._state.player.x, this._controller._state.player.y),
            450);

            // Run the shoot animation
            this.runAnimation(256, 512, {
                speed     : 250,
                singlerun : true
            }, ge.bind(function () {
                this._state.spriteOffsetX = 256;
            }, this));

            this._shoot = undefined;
        }

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },


    // Nazi died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        // Adjust stats
        stfp.stats.nazi_kills++;

        this.runAnimation(512, 768, {
            speed     : 150,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 704;
        }, this));

        stfp.main.checkWin();
    }
});



stfp.Macho1 = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this.id = id;
        this._dead = false;
        this._shoot = undefined;
        this._playerAware = false;
        this._playerSeenSound = new Audio();
        this._playerSeenSound.src = "snd/achtung.ogg";
        this._deadSound = new Audio();
        this._deadSound.src = "snd/mi_abuelo_murio.ogg";
        this._shotSound = new Audio();
        this._shotSound.src = "snd/guard_shot.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/macho1.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "red",
            spriteOffsetX   : 0,
            speed           : 0
        };
        controller.addSprite(this._state);

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        var playerSeen = this._state.hitList.length !== 0;

        if (!this._playerAware && !playerSeen) {
            // Do nothing if we don't see the player and we are not aware of him
            this._state.speed = 0;
            return;
        }
        if (this._playerAware === false) {
            // We see the player for the first time
            this._playerSeenSound.play();
            this._playerAware = true;

            // NOTE: Activate this for extra difficulty
            // this._shoot = true;
        }

        // Calculate vector on the player
        var vp_x = this._controller._state.player.x-this._state.x,
            vp_y = this._controller._state.player.y-this._state.y;

        // Calculate angle phi on the player
        this._state.rot = Math.atan2(vp_y, vp_x);

        if (!playerSeen || this._shoot === undefined) {
            this._state.speed = 0.5;
            this.runAnimation(0, 256, {
                speed     : 150,
                oscillate : false
            });
            this._shoot = true;

        } else {
            // We see the player and we can shoot

            // We need to stop
            this._state.speed = 0;

            window.setTimeout(ge.bind(function (oldx, oldy) {
                var vp_x = oldx - this._controller._state.player.x,
                    vp_y = oldy - this._controller._state.player.y,
                    move_dist = Math.sqrt(vp_x * vp_x + vp_y * vp_y);

                this._shotSound.play();

                // If the player didn't move while the enemy is shooting he was "shot at"
                if (move_dist < 0.5) {
                    // During the shoot animation tell the player that he was shot at.
                    // Player object decides if it was hit.
                    stfp.player.hit(this);
                }
            }, this, this._controller._state.player.x, this._controller._state.player.y),
            450);

            // Run the shoot animation
            this.runAnimation(256, 384, {
                speed     : 250,
                singlerun : true
            }, ge.bind(function () {
                this._state.spriteOffsetX = 256;
            }, this));

            this._shoot = undefined;
        }

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },


    // Nazi died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        // Adjust stats
        stfp.stats.nazi_kills++;

        this.runAnimation(384, 640, {
            speed     : 150,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 576;
        }, this));

        stfp.main.checkWin();
    }
});


stfp.Macho2 = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this.id = id;
        this._dead = false;
        this._shoot = undefined;
        this._playerAware = false;
        this._playerSeenSound = new Audio();
        this._playerSeenSound.src = "snd/achtung.ogg";
        this._deadSound = new Audio();
        this._deadSound.src = "snd/fidemundo.ogg";
        this._shotSound = new Audio();
        this._shotSound.src = "snd/guard_shot.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/macho2.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "red",
            spriteOffsetX   : 0,
            speed           : 0
        };
        controller.addSprite(this._state);

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        var playerSeen = this._state.hitList.length !== 0;

        if (!this._playerAware && !playerSeen) {
            // Do nothing if we don't see the player and we are not aware of him
            this._state.speed = 0;
            return;
        }
        if (this._playerAware === false) {
            // We see the player for the first time
            this._playerSeenSound.play();
            this._playerAware = true;

            // NOTE: Activate this for extra difficulty
            // this._shoot = true;
        }

        // Calculate vector on the player
        var vp_x = this._controller._state.player.x-this._state.x,
            vp_y = this._controller._state.player.y-this._state.y;

        // Calculate angle phi on the player
        this._state.rot = Math.atan2(vp_y, vp_x);

        if (!playerSeen || this._shoot === undefined) {
            this._state.speed = 0.5;
            this.runAnimation(0, 256, {
                speed     : 150,
                oscillate : false
            });
            this._shoot = true;

        } else {
            // We see the player and we can shoot

            // We need to stop
            this._state.speed = 0;

            window.setTimeout(ge.bind(function (oldx, oldy) {
                var vp_x = oldx - this._controller._state.player.x,
                    vp_y = oldy - this._controller._state.player.y,
                    move_dist = Math.sqrt(vp_x * vp_x + vp_y * vp_y);

                this._shotSound.play();

                // If the player didn't move while the enemy is shooting he was "shot at"
                if (move_dist < 0.5) {
                    // During the shoot animation tell the player that he was shot at.
                    // Player object decides if it was hit.
                    stfp.player.hit(this);
                }
            }, this, this._controller._state.player.x, this._controller._state.player.y),
            450);

            // Run the shoot animation
            this.runAnimation(256, 448, {
                speed     : 250,
                singlerun : true
            }, ge.bind(function () {
                this._state.spriteOffsetX = 256;
            }, this));

            this._shoot = undefined;
        }

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },


    // Nazi died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        // Adjust stats
        stfp.stats.nazi_kills++;

        this.runAnimation(512, 704, {
            speed     : 150,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 448;
        }, this));

        stfp.main.checkWin();
    }
});


stfp.Hitler = ge.Class.create(stfp.AnimatedSprite, stfp.MovingSprite, {

    init : function(id, x, y, controller) {
        "use strict";

        this.id = id;
        this._dead = false;
        this._shoot = undefined;
        this._playerAware = false;
        this._playerSeenSound = new Audio();
        this._playerSeenSound.src = "snd/achtung.ogg";
        this._deadSound = new Audio();
        this._deadSound.src = "snd/fidemundo.ogg";
        this._shotSound = new Audio();
        this._shotSound.src = "snd/guard_shot.ogg";

        this._controller = controller;
        this._state = {
            id              : id,
            x               : x,
            y               : y,
            spriteAtlas     : "img/hitler.png",
            isMoving        : true,
            drawOnMinimap   : true,
            minimapColor    : "red",
            spriteOffsetX   : 0,
            speed           : 0
        };
        controller.addSprite(this._state);

        this.runMove(1000);
    },

    move : function () {
        "use strict";

        if (this._dead) {
            return false;
        }

        var playerSeen = this._state.hitList.length !== 0;

        if (!this._playerAware && !playerSeen) {
            // Do nothing if we don't see the player and we are not aware of him
            this._state.speed = 0;
            return;
        }
        if (this._playerAware === false) {
            // We see the player for the first time
            this._playerSeenSound.play();
            this._playerAware = true;

            // NOTE: Activate this for extra difficulty
            // this._shoot = true;
        }

        // Calculate vector on the player
        var vp_x = this._controller._state.player.x-this._state.x,
            vp_y = this._controller._state.player.y-this._state.y;

        // Calculate angle phi on the player
        this._state.rot = Math.atan2(vp_y, vp_x);

        if (!playerSeen || this._shoot === undefined) {
            this._state.speed = 0.5;
            this.runAnimation(0, 256, {
                speed     : 150,
                oscillate : false
            });
            this._shoot = true;

        } else {
            // We see the player and we can shoot

            // We need to stop
            this._state.speed = 0;

            window.setTimeout(ge.bind(function (oldx, oldy) {
                var vp_x = oldx - this._controller._state.player.x,
                    vp_y = oldy - this._controller._state.player.y,
                    move_dist = Math.sqrt(vp_x * vp_x + vp_y * vp_y);

                this._shotSound.play();

                // If the player didn't move while the enemy is shooting he was "shot at"
                if (move_dist < 0.5) {
                    // During the shoot animation tell the player that he was shot at.
                    // Player object decides if it was hit.
                    stfp.player.hit(this);
                }
            }, this, this._controller._state.player.x, this._controller._state.player.y),
            450);

            // Run the shoot animation
            this.runAnimation(256, 448, {
                speed     : 250,
                singlerun : true
            }, ge.bind(function () {
                this._state.spriteOffsetX = 256;
            }, this));

            this._shoot = undefined;
        }

        return !this._dead;
    },

    isDead : function () {
        "use strict";
        return this._dead;
    },


    // Hitler died
    //
    kill : function () {
        "use strict";

        this._dead = true;
        this._state.speed = 0;
        this._deadSound.play();

        // Adjust stats
        stfp.stats.nazi_kills++;

        this.runAnimation(512, 960, {
            speed     : 150,
            singlerun : true
        }, ge.bind(function () {
            this._state.spriteOffsetX = 448;
        }, this));

        stfp.main.checkWin();
    }
});
