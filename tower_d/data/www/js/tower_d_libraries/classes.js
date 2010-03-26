/*===========================================================================
 *
 * Game Class
 *
=============================================================================*/
/*Create a game class.  The game object controls various gameplay settings*/
var Game = new Class({
    Implements: [Options],
    
    //Set the attributes / options
    options: {
        //Base tower cost
        tower_base_cost: 10,
        //Resell value of towers (percentage)
        tower_resell_value: .75,

        //Creep values
        creep_value_base: 5,
        creep_value_modifier: .5

    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);
    },

    get_creep_value: function(level){
        //Returns a gold cost for the creep based on the
        //  level passed in
        var creep_value = this.options.creep_value_base + Math.round(
                            this.options.creep_value_modifier * level);
        return creep_value;
    }
})


/*===========================================================================
 *
 * Zone Class
 *
=============================================================================*/
/*Create a zone class.  Each zone contains a grid.  Ideally, the grid will be
 * just one grid of many zones in the 'world' class*/

var Zone = new Class({
    Implements: [Options],
    
    //Set the attributes / options
    options: {
        //Zone name
        name: 'Zone_01',
        
        //Element (the HTML element)
        element: {},

        //The zone grid (ideally, this will be recieved from the server
        //Is created on init
        grid: null,
        grid_container_element: 'grid_container',
        grid_is_displayed: false,

        //Cell size of the grid
        cell_size: 16,

        //Store a grid of all the cell objects. Should match up exactly
        //  to this.options.grid
        cell_objects_grid: [[]],

        //store a path
        path: [ //Top Left > Down
                [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],
                [1,11],[1,12],[1,13],[1,14],[1,15],[1,16],[1,17],[1,18],[1,19],
                [1,20],[1,21],[1,22],[1,23],[1,24],[1,25],
                //Bottom Left > Right
                [2,25],[3,25],[4,25],[5,25],[6,25],[7,25],[8,25],[9,25],[10,25],
                [11,25],[12,25],
                //Middle Left > Up
                [12,24],[12,23],[12,22],[12,21],[12,20],[12,19],[12,18],[12,17],
                [12,16],[12,15],[12,14],[12,13],[12,12],[12,11],[12,10],[12,9],
                [12,8],[12,7],[12,6],[12,5],[12,4],[12,3],[12,2],[12,1],
                //Top Middle > Right
                [13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],
                [22,1],
                //Right Middle > Down
                [22,2],[22,3],[22,4],[2325],[22,6],[22,7],[22,8],[22,9],[22,10],
                [22,11],[22,12],[22,13],[22,14],[22,15],[22,16],[22,17],[22,18],
                [22,19],[22,20],[22,21],[22,22],[22,23],[23224],[22,25],
                //Right Bottom > Right (To goal)
                [24,25],[25,25],[26,25]
                ] 
    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);

        if(this.options.grid === null){
            //Build a simple grid matrix
            this.options.grid = [
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
            ]
        }

        //Call method to create the grid elements
        this.create_cells();
    },

    /*--------------------------------
     * Methods
     * -------------------------------*/
    create_cells: function(opacity){
        /*Will populate the grid_container HTML element
         * with a bunch of cells based on the cell size and create a 
         * border around the bottom and right edges*/
                      
        //Set the grid container's inital opacity to 0
        $(this.options.grid_container_element).setStyle('opacity', .9);

        //Store the zone object as that
        var that = this;

        //Loop through the grid (rows, then columns)
        for(var i=0; i < this.options.grid.length; i++){
            for(var j=0; j < this.options.grid[i].length; j++){
                //j is really the X coordinate, i is the Y coordinate
                var cell_object = new Cell({
                    'pos_x': j, 'pos_y': i,
                    'cell_value': this.options.grid[i][j]
                }, this);
                
                //Add cell object to zone cell list
                this.options.cell_objects_grid[i].include(cell_object);
                
                //Add it to the grid container
                $(this.options.grid_container_element).adopt(cell_object.options.element);    
            }
            //Add an empty array to the cell_object_grid
            //  Don't add an empty list to the end
            if(i !== this.options.grid.length - 1){
                this.options.cell_objects_grid.include([]);
            }
        }
    },

    toggle_grid: function(opacity){
        
        //Fade the grid container to the opacity passed in (if any)
        if(opacity === undefined){
            opacity = .5;
        }
        
        if(this.options.grid_is_displayed === true){
            //Hide the grid
            this.options.grid_is_displayed = false;
           
            var that = this;
            $each($$('.grid_cell'), function(i){ i.addClass('grid_cell_hidden'); })
        }
        else{
            //Show the grid
            this.options.grid_is_displayed = true;

            var that = this;
            $each($$('.grid_cell'), function(i){ i.removeClass('grid_cell_hidden'); })
        }
    }
});

/*===========================================================================
 *
 * Cell Class
 *
=============================================================================*/
/*Create a cell class.
 * Each cell is an object with an element and various properties, such as 
 * if a tower is on it, if it is able to have a tower on it, etc. */

var Cell = new Class({
    Implements: [Options],

    //Set the attributes / options
    options: {
        //The pos_x and pos_y are the position on the grid
        pos_x: 0,
        pos_y: 0,

        //the html element
        element: {},

        //the value (passed in from the grid)
        cell_value: 0,

        //The cell objects are associated with a zone object
        //  Do not set the zone_object here though or MooTools
        //  will clone it; we want a reference
        zone_object: {},

        //Holds a reference to the creep(s) a cell contains 
        contained_creeps: [],
        //Holds a reference to the tower a cell contains
        contained_tower: null,
        //Holds a reference to tower(s) that have a radius that
        //  extend to this cell
        towers_in_range: []
    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options, zone_object){
        //set the object's attributes / options
        this.setOptions(options);

        //Set the zone object reference here.  Otherwise, it would be set
        //  as a copy
        this.options.zone_object = zone_object;

        //that equals the current cell object
        var that = this;
        
        //Create the cell element (a div)
        this.options.element = new Element('div', {
            'id': 'grid_cell_' + that.options.pos_x + '_' + that.options.pos_y,
            'class': 'grid_cell grid_cell_hidden',
            'styles': {
                'height': that.options.zone_object.options.cell_size - 1,
                //y and x are reversed here because of the way we store it
                //  y is the 'outter' loop which really is like the x value,
                //  but if used x here instead of y, we would have to set the
                //  pos_y to x instead of y.  When we access the array, the 
                //  array is stored to look like a cartesian x,y coordinate
                //  system but we access the array as [y][x]
                'left': that.options.pos_x * that.options.zone_object.options.cell_size,
                'top': that.options.pos_y * that.options.zone_object.options.cell_size,
                'width': that.options.zone_object.options.cell_size - 1,
            },
            'events' : {
                //Highlight cell
                'mouseenter': function(el){
                    if(that.options.zone_object.options.grid_is_displayed === true){
                        //See if the grid has a 0 in the current location
                        //  as it's value
                        //Get the grid's value (y,x)
                        if(that.options.cell_value === 0){
                            that.options.element.addClass('grid_cell_hover_value_0');
                        }
                        else{
                            //It's not a 0
                            that.options.element.addClass('grid_cell_hover_value_1');
                        }
                    }
                },

                //Return cell to normal color
                'mouseleave': function(el){
                    if(that.options.zone_object.options.grid_is_displayed === true){
                        that.options.element.removeClass('grid_cell_hover_value_0');
                        that.options.element.removeClass('grid_cell_hover_value_1');
                    }
                },            

                /*--------------------------------
                 * Click event on cell
                 * -------------------------------*/
                'click': function(el){
                    if(Player_Object.options.mode === 'selection'){
                        that.click_selection_mode();
                    }
                    else if(Player_Object.options.mode === 'build'){
                        that.click_build_mode();
                    }
                }
            }
        });
    },

    /*--------------------------------
     * Methods
     * -------------------------------*/
    /*The following methods work when the grid is active.
     * click_selection_mode and click_build_mode will get information about
     * the object that tied to a current cell. */
    click_selection_mode: function(){
        //get information (if any) about the object occupying the current cell
        //a similar function is also called when the html element for a tower
        //  is clicked on
        console.log(this.options.contained_creeps,this.options.pos_x,
                    this.options.pos_y);
    },

    click_build_mode: function(el){
        //check to see if we can place a building in the cell
        if(this.options.cell_value !== 0){
            /*We can place a tower on the cell, so try to*/

            //see if the Player_Object has enough money
            if(Player_Object.options.gold >= Game_Object.options.tower_base_cost){
                //TODO: make request to server to see if the Player_Object gold matches on server

                //create a tower object
                var tower = new Tower({'pos_x': this.options.pos_x, 
                        'pos_y': this.options.pos_y});

                //decrease the Player_Object's gold by the base tower cost amount
                Player_Object.options.gold -= Game_Object.options.tower_base_cost;

                //update the HTML element that shows gold amount
                $(Player_Object.options.html_gold).set('html', 
                        Player_Object.options.gold);
            }

        //get out of build mode
        Player_Object.options.mode = 'selection';
        this.options.element.removeClass('grid_cell_hover_value_0');
        this.options.element.removeClass('grid_cell_hover_value_1');

        //hide the grid
        Zone_Object.toggle_grid();
        }
    },

    adopt_tower: function(tower_reference){
        //adopt_tower: takes in an object and adds it to this object's 
        //  contained_creeps
        this.options.contained_tower = tower_reference;
        
        //set the cell value to 0 (we can't build on a cell already used)
        this.options.cell_value = 0;
    },

    remove_tower: function(){
        //remove_tower: remove an object reference
        this.options.contained_tower = null;

        //reset the cell value to 1 (we can build on it)
        this.options.cell_value = 1;
    },

    //Add reference to tower that has a range that contains this cell
    adopt_tower_in_range: function(tower_reference){
        //Add a passed in tower to the towers in range array
        this.options.towers_in_range.push(tower_reference);        
    },
    remove_tower_in_range: function(tower_reference){
        //Remove the passed in tower from the array of towers in range
        this.options.towers_in_range.erase(tower_reference);
    }

});

/*===========================================================================
 *
 * Tower Class
 *
=============================================================================*/
/*Create a Tower Class.
 *  This will store all the information about towers.  Towers are saved with
 *  both grid coordinates and css coordinates.  A cell may contain a tower. */

var Tower = new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Store the character element (empty now, filled in on initialize)
        element: {},
        element_id: null,

        //Keep track of number of towers that have been created
        tower_id: 0,
        //Store the ID of the tower in the player's towers_owned array
        player_owned_id: 0,

        add_to_map: true,

        //HTML Element Names
        html_name: 'tower_selected_name',
        html_damage: 'tower_obj_damage',
        html_damage_upgrade: 'tower_button_upgrade_damage',
        html_delay: 'tower_obj_delay',
        html_delay_upgrade: 'tower_button_upgrade_delay',
        html_range: 'tower_obj_range',
        html_range_upgrade: 'tower_button_upgrade_range',
            //Elemental Values
            html_elemental_dark: 'tower_obj_elemental_dark',
            html_elemental_dark_upgrade: 'tower_button_upgrade_elemental_dark',
            html_elemental_earth: 'tower_obj_elemental_earth',
            html_elemental_earth_upgrade: 'tower_button_upgrade_elemental_earth',
            html_elemental_fire: 'tower_obj_elemental_fire',
            html_elemental_fire_upgrade: 'tower_button_upgrade_elemental_fire',
            html_elemental_light: 'tower_obj_elemental_light',
            html_elemental_light_upgrade: 'tower_button_upgrade_elemental_light',
            html_elemental_water: 'tower_obj_elemental_water',
            html_elemental_water_upgrade: 'tower_button_upgrade_elemental_water',
            html_elemental_wind: 'tower_obj_elemental_wind',
            html_elemental_wind_upgrade: 'tower_button_upgrade_elemental_wind',
        html_sell_button: 'tower_button_sell',

        //Position
        pos_x: 0,
        pos_y: 0,

        //How many cells needed for both x and y 
        //  e.g. 2 would mean it really takes up 4 cells (2x + 2y = 4)
        cells_size_xy: 1,

        //Base attributes
        level_damage: 0,
        damage: 1,

        //delay is in MS
        level_delay: 0,
        delay: 1000,

        //How far out the towers can shoot (in cells)
        level_range: 0,
        range: 3,
        
        //Spped the bullet moves
        bullet_speed: 500,

        //number of creatures killed
        creeps_killed: 0,

        //elemental attributes
        elementals: {'dark':0,
                    'earth':0,
                    'fire':0,
                    'light':0,
                    'water':0,
                    'wind':0,
                },

        //Store any elemental effects that this tower has
        elementals_effects: {'dark': {'tick_delay':1000,
                                    'tick_damage':0,
                                    'tick_number':0
                                    },
                            'earth': {'slow_amount':0,
                                        'slow_duration':0
                                    },
                            'wind': {'stun_chance':0, 
                                    'stun_duration':0}},

        //Value (Money Player_Object has spent on this tower)
        value: 0,

        //css color
        color: '#000000',
        
        //Keep track of the attack timer.  Every time a creep attacks,
        //  the timer is reset to this.options.delay
        attack_timer: 0,

        //Reference to Player_Object this tower belongs to
        Player_Object_reference: {},

        //Reference to the cell the tower belongs in
        cell_reference: {},

        //contains references to the cells in the tower's radius / range
        cells_in_range: [],

        //Determine if radius is visible
        radius_visible: false,

        //The creep aggro list, which is a priority list of creeps the tower 
        //  wants to attack.  When a creep enters the tower radius, it is
        //  pushed to this list. When it leaves, it is removed
        creep_aggro_array: []
    },
     /*--------------------------------
     * Constructor
     * -------------------------------*/
    //initialize is a MooTools constructor
    //each tower expects a Player_Object object to be passed into it so it knows
    //  who it belongs to.  By default, it's just the Player_Object playing so
    //  this won't change for now, but we might want to allow multiple users
    //  to play and place towers in the same grid
    initialize: function(options, zone_reference, Player_Object_reference){
        this.setOptions(options); 

        //Set that for reference
        var that = this;

        //set the zone and Player_Object references if not set
        if(Player_Object_reference === undefined){
            Player_Object_reference = Player_Object;
        }
        if(zone_reference === undefined){
            zone_reference = Zone_Object;
        }

        //Set the cell reference
        //  set i and j to the passed in y and x coordinates
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Store which Player_Object the tower belongs to
        Player_Object.options.towers_owned.push(this);

        //Set the value of the array index
        this.options.player_owned_tower_index =
            Player_Object_reference.options.towers_owned.length - 1;
            
        //set the cell reference
        this.options.cell_reference = Zone_Object.options.cell_objects_grid[i][j];

        //call the target cell object's adopt method to add this tower object
        //  to the cell object's contained_creeps list
        Zone_Object.options.cell_objects_grid[i][j].adopt_tower(this);

        //Set the Player_Object reference
        this.options.Player_Object_reference = Player_Object_reference;

        //set the html element id
        this.options.element_id = 'Tower ' 
            + Player_Object.options.towers_owned.length;
       
        //Set element options
        this.options.element =  new Element('div', {
            'id': this.options.element_id,
            'class': 'tower_base',
            'styles': {
                'background-color':this.options.color,
                'height': Zone_Object.options.cell_size - 2 + 'px', 
                'left':this.options.pos_x * Zone_Object.options.cell_size,
                'top':this.options.pos_y * Zone_Object.options.cell_size,
                'width': Zone_Object.options.cell_size - 2 + 'px',
                'z-index': '1337'
            },
            'events': {
                'click': function(evt){
                    //stop propagation
                    evt.stop();
                    that.select_tower();
                }
            }
        });

        //Update the cells in the tower's range
        this.update_cells_in_range();
      
        //Add the element to the map if set to true
        if(this.options.add_to_map === true){
            $('zone_container').adopt(this.options.element);
        }

    },
    /*----------------------------------------------------------------------
     * Methods
     * ---------------------------------------------------------------------*/
    select_tower: function(){
        //Determine if creep is selected
        var creep_selected = Player_Object.options.html_creep_selected_wrapper;
        if($(creep_selected).getStyle('opacity')>0){
            $(creep_selected).setStyle('opacity', 0);
        }
        //Show the radius
        this.toggle_radius_display(); 

        //Update the Player_Object's selection
        Player_Object.options.selected_creep = null;
        Player_Object.options.selected_tower = this;

        //Update the HTML elements
        $(this.options.html_name).set('html', this.options.element_id);
        $(this.options.html_damage).set('html', this.options.damage);
        $(this.options.html_delay).set('html', this.options.delay);
        $(this.options.html_range).set('html', this.options.range);
        //Elemental Text
        $(this.options.html_elemental_dark).set('html', 
                                this.options.elementals['dark']);
        $(this.options.html_elemental_earth).set('html', 
                                this.options.elementals['earth']);
        $(this.options.html_elemental_fire).set('html', 
                                this.options.elementals['fire']);
        $(this.options.html_elemental_light).set('html', 
                                this.options.elementals['light']);
        $(this.options.html_elemental_water).set('html', 
                                this.options.elementals['water']);
        $(this.options.html_elemental_wind).set('html', 
                                this.options.elementals['wind']);

        if(Player_Object.options.selected_tower === this){
            $(Player_Object.options.html_tower_selected_wrapper).setStyle('opacity',1);
        }
        else{
            $(Player_Object.options.html_tower_selected_wrapper).setStyle('opacity',0);
        }   
    }, 

    /*----------------
     * Radius display
     * ---------------*/
    toggle_radius_display: function(){
        var that = this;
       
        //Get the length of the cells contained in the tower's radius
        var cells_in_range_len = this.options.cells_in_range.length;

        //Toggle the radius
        if(this.options.radius_visible === false){
            var that = this;
    
            //Turn off the visibility of the radius for other towers the Player_Object
            //owns
            var num_towers = Player_Object.options.towers_owned.length;

            //Go through all the towers the Player_Object owns and turn off the radius
            //visibility
            for(var count=0; count<num_towers; count++){
                Player_Object.options.towers_owned[count].hide_radius_display();
            }
            //Set the current tower's radius' visibilty to true (it is set to 
            //  false in the above loop)

            //Show the radius
            this.options.radius_visible = true;

            //add a class to the cells that are contained in the tower's radius
            $each(that.options.cells_in_range, function(i){ 
                    i.options.element.addClass('grid_cell_show_radius')});

        }
        else{
            //Turn off the radius display
            this.hide_radius_display();
        }
    },
    

    hide_radius_display: function(){
        //Turn the radius off
        this.options.radius_visible= false;

        var that = this;
        var cells_in_range_len = this.options.cells_in_range.length;

        for(var count=0; count<cells_in_range_len; count++){
            that.options.cells_in_range[count].options.element.removeClass('grid_cell_show_radius');
        }
    },
    

    /*----------------
     * Upgrade tower
     * ---------------*/
    upgrade: function(type){
        if(type === 'damage'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_damage);
            var next_level_cost = this.calc_upgrade_cost(type, 
                                    this.options.level_damage+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;
                
                //Increase tower damage
                this.options.damage += 1;
                this.options.level_damage += 1;

                //Update the damage text
                $(this.options.html_damage).highlight('#2222dd');
                $(this.options.html_damage).set('html', this.options.level_damage);

                $(this.options.html_damage_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'delay'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_delay);
            var next_level_cost = this.calc_upgrade_cost(type,
                                    this.options.level_delay+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.delay -= 15;
                this.options.level_delay += 1;

                //Update the delay text
                $(this.options.html_delay).highlight('#2222dd');
                $(this.options.html_delay).set('html', this.options.delay);

                $(this.options.html_delay_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'range'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_range);
            var next_level_cost = this.calc_upgrade_cost(type,
                                    this.options.level_range+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.range += 1;
                this.options.level_range += 1;

                //Update the cells in the range
                this.update_cells_in_range();

                //Update the radius
                this.toggle_radius_display();
                this.toggle_radius_display();

                //Update the range text
                $(this.options.html_range).highlight('#2222dd');
                $(this.options.html_range).set('html', this.options.level_range);
                    
                $(this.options.html_range_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        /*--------------------
         * ELEMENTAL UPGRADES
         * -------------------*/
        else if(type === 'elemental_dark'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['dark']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['dark'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['dark'] += 1;

                //Update the text
                $(this.options.html_elemental_dark).highlight('#2222dd');
                $(this.options.html_elemental_dark).set('html',
                                            this.options.elementals['dark']);
                    
                $(this.options.html_elemental_dark_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_earth'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['earth']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['earth'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['earth'] += 1;

                //Update the text
                $(this.options.html_elemental_earth).highlight('#2222dd');
                $(this.options.html_elemental_earth).set('html',
                                            this.options.elementals['earth']);
                    
                $(this.options.html_elemental_earth_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_fire'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['fire']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['fire'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['fire'] += 1;

                //Update the text
                $(this.options.html_elemental_fire).highlight('#2222dd');
                $(this.options.html_elemental_fire).set('html',
                                            this.options.elementals['fire']);
                    
                $(this.options.html_elemental_fire_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_light'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['light']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['light'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['light'] += 1;

                //Update the text
                $(this.options.html_elemental_light).highlight('#2222dd');
                $(this.options.html_elemental_light).set('html',
                                            this.options.elementals['light']);
                    
                $(this.options.html_elemental_light_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_wind'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['wind']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['wind'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['wind'] += 1;

                //Update the text
                $(this.options.html_elemental_wind).highlight('#2222dd');
                $(this.options.html_elemental_wind).set('html',
                                            this.options.elementals['wind']);
                    
                $(this.options.html_elemental_wind_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
    },

    

    //TODO: Refactor this stuff
    //Calculate the upgrade cost from the current to the next level
    calc_upgrade_cost: function(type, level){
        //Return the cost to upgrade based on the type passed in
        if(type === 'damage'){
            return Game_Object.options.tower_base_cost
                    + Math.round(Math.pow(1.3, level));
        }
        if(type === 'delay'){
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(1.3, level));
        }
        if(type === 'range'){
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(2.3, level));
        }
        else{
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(1.5, level));
        }
    },
    

  
    /*----------------
     * Update tower
     * ---------------*/
    update_cells_in_range: function(){
        //clear the cells in range
        this.options.cells_in_range.length = 0;
       
        //Set loop length (saves a little bit of time)
        var loop_length = this.options.range + 1;
        var range_value = -this.options.range;

        //Set the i,j to access the grid
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Set that to this
        var that = this;

        //Set the tower's radius (will need to be updated when range is upgraded)
        for(var count_i=range_value; count_i<loop_length; count_i++){
            for(var count_j=range_value; count_j<loop_length; count_j++){
                //Make sure i+count_i and j+count_j are defined.  If not,
                //  don't add a cell.  This will happen if we try to create
                //  a tower near the edge of the map
                if(Zone_Object.options.cell_objects_grid[i+count_i] !== undefined &&
                    Zone_Object.options.cell_objects_grid[j+count_j] !== undefined){

                    //Add a reference to the cell the radius contains
                    this.options.cells_in_range.push(
                            Zone_Object.options.cell_objects_grid[i+count_i][j+count_j]);

                    //Add a reference to this tower for each cell that this
                    //  radius contains
                    Zone_Object.options.cell_objects_grid[i+count_i][j+count_j].adopt_tower_in_range(
                        that);
                }
            }   
        }
    },
    

    /*----------------
     * Attack
     * ---------------*/
    attack: function(target){
        //When called, attack target.  Pass in an object that has an i and j for now
        var that = this;
        
        //See if the tower can attack
        if(this.options.attack_timer === 0){
            //See if there is a target
            if(target.options.health <= 0){
                this.options.creep_aggro_array.erase(target);
                return;
            }
            //Attack!

            //Set the target cell
            var creep_i = target.options.pos_y;
            var creep_j = target.options.pos_x;
            
            //Store the target cell for splash damage / chaining
            var cell_target = Zone_Object.options.cell_objects_grid[
                creep_i][creep_j];
          
            //Create a new element for the 'bullet', tween the bullet
            //  to the target then destroy the bullet element
            var bullet_element = new Element('div', {
                'class':'tower_bullet_base',
                'styles': {'left': that.options.element.getStyle('left'),
                            'top': that.options.element.getStyle('top')
                        }
            });
            //add the bullet element to the grid container
            $(Zone_Object.options.grid_container_element).adopt(bullet_element);
            
            //Reset the attack timer
            this.reset_attack_timer();

            //Create a bullet tween Fx object
            var bullet_tween = new Fx.Morph(bullet_element, {
                duration: that.options.bullet_speed,
                transition: Fx.Transitions.Linear
            });

            //Set a left and top amount to move the bullet to
            //  This amount is added to the left and top of the bullet
            //  tween so the bullet ends closer to the creep
            var cell_size = Zone_Object.options.cell_size;

            var bullet_amount_left = cell_size;
            var bullet_amount_top = cell_size;

            //The values will be negative if the directions are 
            //  left or up (left += X for CSS, top += Y for CSS)
            if(target.options.dir_facing === 'left'){
                bullet_amount_left *= -1;
            }
            if(target.options.dir_facing === 'up'){
                bullet_amount_top *= -1;
            }
           
            /*----------------
             * Build Target List
             * ---------------*/
            //If the tower can do splash damage or chains creeps, we need
            //  to add the effected creeps to the tower's effected target list
            //This will have AT LEAST the tower's inital target
            var targets_effected = [{creep:target, 
                                    damage:that.options.damage}];
         
            /*===============================================================
             *
             *              ELEMENTAL DAMAGE
             *
             * TODO: Should elementals stack? E.G. Should wind stun creeps in
             * an AOE radius if the tower also has fire?  Or stun and chain
             * with light?
             * ==============================================================*/
            /*============ ELEMENTAL: FIRE - SPLASH DAMAGE ==================*/
            //For splash damage, set the radius
            //FIRE ELEMENTAL = SPLASH
            //  Splash damage affects all creeps in surrounding cells.  As the
            //  fire elemental skill increases, the radius and damage also 
            //  increases.
            var elemental_value_fire = this.options.elementals['fire'];
            if(elemental_value_fire > 0){
                /*-------- Set up Radius ------------------*/
                var radius = Math.ceil(elemental_value_fire / 40) + 1;
                var radius_pos = radius + 1;
                var radius_neg = -radius;

                //use x and y of target cell
                var i = cell_target.options.pos_y;
                var j = cell_target.options.pos_x;

                var cells_effected = [];

                for(var count_i=radius_neg; count_i<radius_pos; count_i++){
                    for(var count_j=radius_neg; count_j<radius_pos; count_j++){
                        //Make sure i+count_i and j+count_j are defined.  If not,
                        //  don't add a cell.  This will happen if we try to create
                        //  a tower near the edge of the map
                        if(Zone_Object.options.cell_objects_grid[i+count_i] !== undefined &&
                            Zone_Object.options.cell_objects_grid[j+count_j] !== undefined){

                            //Add a reference to the cell the radius contains
                            cells_effected.push(
                                    Zone_Object.options.cell_objects_grid[i+count_i][j+count_j]);
                        }
                    }   
                }
                
                //If the tower has a certain elemental, it may need to have
                //  more creeps in its target list
                //Loop through others and push if need be
                //
                //Clear the effected targets list because we'll be rebuilding here
                //  (We don't want duplicate targets)
                targets_effected = [];

                //The first creep will recieve the majority of the damage, 
                //  creeps around it will recieve less.  splash_dmg is overwritten
                //  in the loop for every creep except the primary target creep
                var splash_dmg = Math.ceil(that.options.damage / 1.5);

                for(i=0; i<cells_effected.length; i++){
                    for(var j=0; j<cells_effected[i].options.contained_creeps.length; j++){
                        //Calculate damage
                        if(j > 0){
                            splash_dmg = (Math.ceil(that.options.damage / 5)
                                        ) + (Math.ceil(elemental_value_fire / 5));
                        }
                        targets_effected.push({creep: cells_effected[i].options.contained_creeps[j],
                                                damage: splash_dmg})
                    }
                }
                
            }
            /*================== END FIRE ==================================*/

            /*============ ELEMENTAL: LIGHT - CHAINING =====================*/
            //For splash damage, set the radius
            //LIGHT ELEMENTAL = SPLASH
            //  Chains affect multiple creeps that are close together.  As the
            //  light elemental skill increases, more creeps are affected,
            //  the distance between the creeps increases and the damage 
            //  increases.
            var elemental_value_light = this.options.elementals['light'];
            if(elemental_value_light > 0){
                /*-------- Number of creeps to chain ------*/
                var num_creeps_to_chain = elemental_value_light;

                /*-------- Set up Radius ------------------*/
                var radius = Math.ceil(elemental_value_fire / 40) + 2;
                var radius_pos = radius + 1;
                var radius_neg = -radius;

                //use x and y of target cell
                var i = cell_target.options.pos_y;
                var j = cell_target.options.pos_x;

                var cells_effected = [];

                for(var count_i=radius_neg; count_i<radius_pos; count_i++){
                    for(var count_j=radius_neg; count_j<radius_pos; count_j++){
                        //Make sure i+count_i and j+count_j are defined.  If not,
                        //  don't add a cell.  This will happen if we try to create
                        //  a tower near the edge of the map
                        if(Zone_Object.options.cell_objects_grid[i+count_i] !== undefined &&
                            Zone_Object.options.cell_objects_grid[j+count_j] !== undefined){

                            //Add a reference to the cell the radius contains
                            cells_effected.push(
                                    Zone_Object.options.cell_objects_grid[i+count_i][j+count_j]);
                        }
                    }   
                }
                
                //Clear the effected targets list because we'll be rebuilding here
                //  (We don't want duplicate targets)
                targets_effected = [];

                //Store the amount of creeps that have been effected
                num_creeps_damaged = 0;
                
                //The first creep will recieve the majority of the damage, 
                // and creeps further down the chain will receive less 
                for(i=0; i<cells_effected.length; i++){
                    for(var j=0; j<cells_effected[i].options.contained_creeps.length; j++){
                        //If the number of creeps have already been reached, end the loop
                        if(num_creeps_damaged >= num_creeps_to_chain){
                            break;
                        }
                        else{
                            //Calculate damage
                            chain_dmg = Math.ceil(that.options.damage / (
                                        num_creeps_damaged + 1)) + (
                                        elemental_value_light / 5);
                            targets_effected.push({creep: cells_effected[i].options.contained_creeps[j],
                                                    damage: chain_dmg})
                            num_creeps_damaged += 1;
                        }
                    }
                }
            }
            /*================== END LIGHT =================================*/

            /*============ ELEMENTAL: WIND - STUN  =========================*/
            //WIND ELEMENTAL = STUN
            //  Has a chance to stun.  The chance and duration of stun will
            //  increase as the elemental skill increase
            var elemental_value_wind = this.options.elementals['wind'];
            if(elemental_value_wind > 0){
                //Determine chance and duration
                //TODO: Come up with better values
                var elemental_wind_stun_chance = 15 + (Math.ceil(
                                    elemental_value_wind / 3));
                var elemental_wind_stun_duration = .2 + (Math.ceil(
                                    elemental_value_wind / 50)) *
                                    1000;
                that.options.elementals_effects['wind']['stun_chance'] = 
                    elemental_wind_stun_chance;
                that.options.elementals_effects['wind']['stun_duration'] = 
                    elemental_wind_stun_duration;
            }
            /*================== END WIND ==================================*/

            /*============ ELEMENTAL: DARK - Damage Over Time ==============*/
            //DARK ELEMENTAL = Damage Over Time 
            //  Adds a damage over time effect to the creep. Damage dealt,
            //  amount of ticks, and time between ticks changes with upgrades
            var elemental_value_dark = this.options.elementals['dark'];
            if(elemental_value_dark > 0){
                //Determine chance and duration
                //TODO: Come up with better values
                //Total number of ticks
                var elemental_dark_tick_number = 2 + Math.ceil(
                                    elemental_value_dark / 10);
                //Damage per tick
                var elemental_dark_tick_damage = Math.ceil(
                                    elemental_value_dark * .2) + 
                                    this.options.damage * .2;
                //Time between ticks
                var elemental_dark_tick_delay =  5 - Math.log(
                                    1 + (elemental_value_dark * .2));

                that.options.elementals_effects['dark']['tick_number'] = 
                    elemental_dark_tick_number;
                that.options.elementals_effects['dark']['tick_damage'] = 
                    elemental_dark_tick_damage;
                that.options.elementals_effects['dark']['tick_delay'] = 
                    elemental_dark_tick_delay;
            }
            /*================== END DARK ==================================*/

            /*============ ELEMENTAL: EARTH - SLOW  ========================*/
            //EARTH ELEMENTAL - SLOW
            //  Slows the creep.  Movement speed and duration are effected by
            //  upgrades
            var elemental_value_earth = this.options.elementals['earth'];
            if(elemental_value_earth > 0){
                //Determine the speed (how much slower the creep moves) and
                //  the duration (how long the effect lasts)
                this.options.elementals_effects['earth']['slow_amount'] = 
                    elemental_value_earth * 10;
                this.options.elementals_effects['earth']['slow_duration'] =
                    elemental_value_earth * 100;

            }
            /*================== END EARTH =================================*/

            /*----------------
             * Move the bullet and damage the creep once the bullet hits
             * ----------------*/
            //move the bullet from the tower to the target
            bullet_tween.start({
                'left': parseInt(target.options.element.getStyle('left')) +
                        bullet_amount_left,
                'top': parseInt(target.options.element.getStyle('top')) +
                        bullet_amount_top
            }).chain(function(){
                /*:::::::::::::::::::::::::
                 * Elemental Damage
                 *:::::::::::::::::::::::::*/
                /*----------------
                 *Wind
                 *----------------*/
                //If there is a wind elemental, attempt to stun the first
                //  creep in the list if the hit is successful
                if(that.options.elementals['wind'] > 0){
                    //calculate chance
                    var stun_chance = Math.floor(Math.random() * 101);
                    
                    //Random will return a value between 0 and the
                    //stun chance, so each value has a 1 in 
                    //stun_chance probability
                    if(stun_chance <= that.options.elementals_effects['wind']['stun_chance']){
                        creep_active_effects = targets_effected[0].creep.options.active_effects;
                        //See if the tower can add a slow effect
                        var stun_allowed = true;
                        //Loop through target creep's effects and if a slow effect
                        //  is on, then set slow_allowed to false
                        for(i=0; i<creep_active_effects.length; i++){
                            if(creep_active_effects[i]['source'] === that){
                                if(creep_active_effects[i]['elemental'] === 'wind'){
                                    slow_allowed = false;
                                    break;
                                }
                            }
                        }
                        //If the tower can add a DoT effect, do so
                        var this_effect_index = creep_active_effects.length;

                        //Add the DoT effect to the creeps' active effect list
                        if(stun_allowed === true){                      
                            var stun_effect = {
                                //We haven't pushed this to the array yet
                                //  so the array length will be the index
                                //  of this new item
                                'index':this_effect_index,
                                'level': that.options.elementals['wind'],
                                'elemental':'wind',
                                'source':that,
                                'html_element': new Element('div', {
                                    'class': 'effect_icon effect_icon_wind'    
                                }),
                                'html_tip_title': 'Wind - Stun',
                                'html_tip_text': '',
                                'effect_function': (function(index,creep){
                                        return function(){
                                            creep.options.creep_tween.resume();
                                            creep.update_html_active_effects();
                                            //See if there are any ticks left
                                            if(creep_active_effects[index] !== undefined){
                                                //End the periodical
                                                $clear(creep_active_effects[index].effect_function);
                                                //Destroy this function
                                                creep_active_effects.splice(index,1);
                                                creep.update_html_active_effects();
                                            }
                                    }})(this_effect_index, targets_effected[0].creep).periodical(
                                        that.options.elementals_effects['wind'].stun_duration)
                            };
                            //Make sure the target index is defined (it will likely
                            //  be undefined if the tower tries to attack a creep that 
                            //  is already dead)
                            //Pause the creep's movement
                            targets_effected[0].creep.options.creep_tween.pause();
                            
                            //Set the effect's tip text (different for each effect)
                            stun_effect.html_tip_text = 'Level: ' 
                                                + stun_effect.level 
                                                + '<br /><br />'
                                                + 'Source: '
                                                + stun_effect.source.options.element_id;


                            creep_active_effects.push(stun_effect);
                        }
                    }
                }
                
                
                /*----------------
                 *Dark
                 *----------------*/
                //If there is a dark element and the target creep does not
                //  have a DoT effect from this tower already, add one
                if(that.options.elementals['dark'] > 0){
                    creep_active_effects = targets_effected[0].creep.options.active_effects;
                    //See if the tower can add a Damage over Time effect
                    var dot_allowed = true;
                    //Loop through target creep's effects and if a DoT is up
                    //  then set dot_allowed to false
                    for(i=0; i<creep_active_effects.length; i++){
                        if(creep_active_effects[i]['source'] === that){
                            if(creep_active_effects[i]['elemental'] === 'dark'){
                                dot_allowed = false;
                                break;
                            }
                        }
                    }
                    //If the tower can add a DoT effect, do so
                    var this_effect_index = creep_active_effects.length;

                    //Add the DoT effect to the creeps' active effect list
                    if(dot_allowed === true){
                        var dot_effect = {
                            //We haven't pushed this to the array yet
                            //  so the array length will be the index
                            //  of this new item
                            'index':this_effect_index,
                            'level': that.options.elementals['dark'],
                            'elemental':'dark',
                            'ticks_left':that.options.elementals_effects['dark']['tick_number'],
                            'source':that,
                            'html_element': new Element('div', {
                                'class': 'effect_icon effect_icon_dark tool_tip',
                            }),
                            'html_tip_title': 'Dark - Damage Over Time',
                            'html_tip_text': '',
                            'effect_function': (function(index,creep){
                                    return function(){
                                    //See if there are any ticks left
                                    if(creep_active_effects[index] !== undefined){
                                        if(creep_active_effects[index].ticks_left > 0){
                                            creep.take_damage(
                                                that.options.elementals_effects['dark'].tick_damage,
                                                that);
                                            creep_active_effects[index].ticks_left -= 1;
                                        }
                                        else{
                                            //End the periodical
                                            $clear(creep_active_effects[index].effect_function);
                                            //Destroy this function
                                            creep_active_effects.splice(index,1);
                                            creep.update_html_active_effects();
                                        }
                                    }
                                }})(this_effect_index, targets_effected[0].creep).periodical(
                                    that.options.elementals_effects['dark'].tick_delay * 
                                1000)
                        };
                        //Set the effect's tip text (different for each effect)
                        dot_effect.html_tip_text = 'Level: ' 
                                                + dot_effect.level 
                                                + '<br /><br />'
                                                + 'Source: '
                                                + dot_effect.source.options.element_id;

                        creep_active_effects.push(dot_effect);
                    }
                }
                /*----------------
                 *Earth
                 *----------------*/
                if(that.options.elementals['earth'] > 0){
                    creep_active_effects = targets_effected[0].creep.options.active_effects;
                    //See if the tower can add a slow effect
                    var slow_allowed = true;
                    //Loop through target creep's effects and if a slow effect
                    //  is on, then set slow_allowed to false
                    for(i=0; i<creep_active_effects.length; i++){
                        if(creep_active_effects[i]['source'] === that){
                            if(creep_active_effects[i]['elemental'] === 'earth'){
                                slow_allowed = false;
                                break;
                            }
                        }
                    }
                    //If the tower can add a DoT effect, do so
                    var this_effect_index = creep_active_effects.length;

                    //Add the DoT effect to the creeps' active effect list
                    if(slow_allowed === true){
                        var slow_effect = {
                            //We haven't pushed this to the array yet
                            //  so the array length will be the index
                            //  of this new item
                            'index':this_effect_index,
                            'level': that.options.elementals['earth'],
                            'elemental':'earth',
                            'source':that,
                            'html_element': new Element('div', {
                                'class': 'effect_icon effect_icon_earth' 
                            }),
                            'html_tip_title': 'Earth - Slow',
                            'html_tip_text': '',
                            'effect_function': (function(index,creep){
                                    return function(){
                                        creep.options.move_speed = 
                                            creep.options.move_speed_base;
                                        creep.update_html_active_effects();
                                        //See if there are any ticks left
                                        if(creep_active_effects[index] !== undefined){
                                            //Return speed to normal
                                            creep.options.move_speed = 
                                                creep.options.move_speed_base;
                                            //End the periodical
                                            $clear(creep_active_effects[index].effect_function);
                                            //Destroy this function
                                            creep_active_effects.splice(index,1);
                                            creep.update_html_active_effects();
                                        }
                                }})(this_effect_index, targets_effected[0].creep).periodical(
                                    that.options.elementals_effects['earth'].slow_duration)
                        };
                        //Make sure the target index is defined (it will likely
                        //  be undefined if the tower tries to attack a creep that 
                        //  is already dead)
                        targets_effected[0].creep.options.move_speed += 
                            that.options.elementals_effects['earth'].slow_amount;
                         
                        //Set the effect's tip text (different for each effect)
                        slow_effect.html_tip_text = 'Level: ' 
                                                + slow_effect.level 
                                                + '<br /><br />'
                                                + 'Source: '
                                                + slow_effect.source.options.element_id;

                        creep_active_effects.push(slow_effect);
                    }

                }
               
                targets_effected[0].creep.update_html_active_effects();
                
                /*----------------
                 *Deal Damage
                 *----------------*/
                for(i=0; i<targets_effected.length; i++){
                    //Deal damage to the creep
                    that.deal_damage(targets_effected[i].creep, 
                                    targets_effected[i].damage);
                }
                //Destroy the bullet element
                bullet_element.destroy();
            });
        }
    },

    reset_attack_timer: function(){
        //Create a function with a delay of this tower's delay
        //  When the delay is up, the timer value will equal 0 
        //  which means the tower can attack.  This function is called
        //  whenever the tower attacks
        
        //Set the attack timer delay 
        this.options.attack_timer = this.options.delay;

        var that = this;

        //Create the function to set the timer to 0
        var attack_timer_function = function(){ 
            that.options.attack_timer = 0;
        };
        
        attack_timer_function.delay(this.options.delay);
    },

    /*----------------
     *
     * (Attack) Deal Damage
     *
     * ---------------*/
    deal_damage: function(target, damage){
        //Will deal damage to the target passed in.
        target.take_damage(damage, this);
    },

    /*----------------
     *
     * Sell Tower
     *
     * ---------------*/
    sell_tower: function(){
        //Calcuate the value of the tower, give the Player_Object money, and destroy
        //  Get the current value
        var tower_value = this.options.value;
        tower_value = tower_value * Game_Object.options.tower_resell_value;
        
        //Give the player gold
        Player_Object.options.gold += tower_value;
        console.log(Player_Object.options.gold, tower_value);

        //Remove the tower
        this.destroy_tower();
    },

    /*----------------
     *
     * Destroy Tower
     *
     * ---------------*/
    destroy_tower: function(){
        //Removes tower from the game
        //Remove HTML element
        $(this.options.element).dispose();

        //Remove tower from player's tower owned list
        Player_Object.options.towers_owned;

        //Remove radius display
        this.hide_radius_display();

        //Unselect tower if it is selected
        if(Player_Object.options.selected_tower === this){
            if(Player_Object.options.selected_tower === this){
                $(Player_Object.options.html_tower_selected_wrapper
                        ).setStyle('opacity',0);
                Player_Object.options.selected_tower = null;
            }
        }

        //Remove cell from grid
        this.options.cell_reference.remove_tower();
    }
});

/*===========================================================================
 *
 * Creep Class
 *
=============================================================================*/
/*Create a creep class.
 * This is our base creep class.*/
var Creep= new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Properties
        name: 'Null',
        health: 5,
        power: 5,

        //Some extra attributes
        armor_class: 0,

        //elemental attributes
        elementals: {'dark':0,
                    'earth':0,
                    'fire':0,
                    'light':0,
                    'water':0,
                    'wind':0,
                },

        //Grid position
        pos_x: 1,
        pos_y: 0,
        //position in the zone's path array
        pos_path: 0,

        //Active buffs
        //  Contains a list of functions that act as effects on the creep 
        //  For instance, any slow effects or damage over time
        //  Structure is:
        //      {'index':index, 'element': element, 'function':function, 
        //          'source':tower_that_owns_this_effect}
        active_effects: [],

        //Speed (tween duration) in MS per move.  Need to save on server also
        move_speed: 275,
        //base_move_speed is the base move speed, used to return the creep's
        //  normal speed if a speed or slow effect wears off
        move_speed_base: 275,
        //Create a new chain for the movement(object created in initialize)
        move_chain: null,
        move_functions: [],
        //Store if the creep is moving to the end
        moving_to_end: false,

        //Creep's tween object
        creep_tween: {},

        //css color
        color: '#000000',
        
        //Store the character element (empty now, filled in on initialize)
        element: {},
        element_id: null,
        add_to_map: true,

        //Store the ID of the creep (increases on every wave)
        creep_id: 0,
        
        //The direction the character is facing
        dir_facing: 'down',
        //Stores the direction the character is moving at any given instant
        dir_moving: {'up':false, 'right':false, 'down':false, 'left':false},

        //HTML Elements
        html_name: 'creep_selected_name',
        html_health: 'creep_selected_health',
        html_power: 'creep_selected_power',
        html_armor_class: 'creep_selected_armor_class',
        html_move_speed: 'creep_selected_move_speed',
        html_active_effects: 'creep_selected_active_effects'
    },

       
     /*--------------------------------
     * Constructor;

        //We don't yet allow for diagonal movement
        var move_direction = '';
        var move_length = 0;
        
        //Stores an array of movement functions
        that.options.move_functions = [];

     * -------------------------------*/
    //initialize is a MooTools constructor
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);

        var that=this;

        //Set the element ID
        if(this.options.element_id === null){
            this.options.element_id = "creep_" + this.options.name + '_'
                                    + creep_list.length;
        }

        this.options.creep_id = creep_list.length;

        //Set element options
        this.options.element =  new Element('div', {
            'id': this.options.element_id,
            'class': 'creep_base',
            'styles': {
                'background':this.options.color,
                'height':Zone_Object.options.cell_size - 2 + 'px',
                'left':this.options.pos_x * Zone_Object.options.cell_size,
                'top':this.options.pos_y * Zone_Object.options.cell_size,
                'width':Zone_Object.options.cell_size - 2 + 'px'
            },
            'events': {
                'click': function(evt){
                    evt.stop();
                    that.select_creep();
                }
            }
        });

        //Add to the map it it should be added
        if(this.options.add_to_map === true){
            $('zone_container').adopt(this.options.element);
        }

        this.options.move_chain = new Chain();
    
        /*:::::::::::::::::::::::::
        //Create the move chain
        /*:::::::::::::::::::::::::*/
        //Set the path so we don't have to retype it everytime
        var path = Zone_Object.options.path;
        
        //Set the path length equal to the actual path length minus 1 because
        //  we will be looking at i + 1 in the loop, and when the loop is at
        //  the last iteration we need to be able to access the last element,
        //  not an element outside the length of the array
        var path_length = Zone_Object.options.path.length - 1;

        //We don't yet allow for diagonal movement
        var move_direction = '';
        var move_length = 0;
        
        //Stores an array of movement functions
        that.options.move_functions = [];

        for(var i=0; i<path_length; i++){
            //Determine direction needed to move
            //Check for y
            if(path[i][0] === path[i+1][0]){
                //x is the same, change y direction
                move_direction = ( path[i][1] < path[i+1][1] ) ? 'down':'up';
                move_length = Math.abs(path[i][1] - path[i+1][1]);
            }
            //Check for x
            if(path[i][1] === path[i+1][1]){
                //y is the same, change x direction
                move_direction = ( path[i][0] < path[i+1][0] ) ? 'right':'left';
                move_length = Math.abs(path[i][0] - path[i+1][0]);
            }
           
            //Tells the creep to go from start to finish based on zone's path
            that.options.move_functions.push(
                    //We need to use a closure here otherwise the variables
                    //  will be set to value of the last iteration
                    function(dir, len, obj){
                        return function(){
                            //call the creep's move function
                            obj.move(dir, len);
                        }}(move_direction, move_length, that));
        }   
        //Add the move functions to the object's move chain
        that.options.move_chain.chain(that.options.move_functions);

    },

    /*----------------------------------------------------------------------
     * Methods
     * ---------------------------------------------------------------------*/
    update_html_active_effects: function(){
        if(Player_Object.options.selected_creep === this){
            var that = this;
            //Copy the active effects
            var active_effects = this.options.active_effects;
          
            //Update the HTML elements
            $(this.options.html_name).set('html', this.options.element_id);
            $(this.options.html_health).set('html', this.options.health);
            $(this.options.html_power).set('html', this.options.power);
            $(this.options.html_armor_class).set('html', this.options.armor_class);
            $(this.options.html_move_speed).set('html', this.options.move_speed);

            $(this.options.html_active_effects).empty();

            //Add the element for each effect
            for(var i=0; i<active_effects.length; i++){
                $(this.options.html_active_effects).adopt(
                        active_effects[i].html_element);
                active_effects[i].html_element.set('title', 
                        active_effects[i].html_tip_title);
                active_effects[i].html_element.set('rel', 
                        active_effects[i].html_tip_text);
            }
            //Add the tool tip
            Tool_Tips.attach('.tool_tip');

        }
    },
    /*----------------
     * Select Creep
     * ---------------*/
    select_creep: function(){
        //Determine if tower is selected
        var tower_selected = Player_Object.options.html_tower_selected_wrapper;
        if($(tower_selected).getStyle('opacity')>0){
            $(tower_selected).setStyle('opacity', 0);
        }
        //Show the selection wrapper
        $(Player_Object.options.html_creep_selected_wrapper).setStyle('opacity', 1);
        
        //Update the Player_Object's selection
        Player_Object.options.selected_tower = null;
        Player_Object.options.selected_creep = this;

        
        //Get the active effects
        this.update_html_active_effects();
    },
    
    /*----------------
     * Move Creep
     * ---------------*/
    /*Move and Tween creep*/
    move: function(direction, amount, cell_size){
        //Direciton is either up, right, down, or left.  It's used to
        //  determine what direction the creep is facing
        //Amount is the amount of cells to move the creep
        //Grid is a passed in grid, but if not passed in will use
        //  Zone_Object's grid
        
        //store this as that so we can refrence it inside other classes
        var that = this;
            
        /*:::::::::::::::::::::::::
         * Move (on the grid) and tween (css) the creep 
         *:::::::::::::::::::::::::*/

        //We're moving the creep in a direction
        that.options.dir_moving[direction] = true;
        //Set the direction the creep is facing
        that.options.dir_facing = direction;

        //set the direction used by CSS (either left or top)
        //  if the directino is up or down, the css_directino is top
        //      otherwise it is left
        css_direction = (direction === 'up' || direction === 'down') ?
                        'top':'left';
    
        //If the direction is up or left, the amount needs to be multipled
        //  by a negative 1
        //amount_modifier the amount to move either up or down or left or 
        //  right.  Since it is just 1 or -1, it is also the value to move
        //  the character on the grid by.
        amount_modifier = (direction === 'up' || direction === 'left') ?
                        -1:1;

        //Change the amount based on modifier
        //Amount is how much to move the character's CSS position
        amount *= amount_modifier;

        /*:::::::::::::::::::::::::
         *See if movement is possible
         *:::::::::::::::::::::::::*/
        //Store the coordinates of the desired move
        //If the css direction is top (direction is up or down), change the
        //  desired_pos_y to be the amount the creep is to move, else the
        //  css_direction is not top so we change the x coordinate
        //
        var desired_pos_x = (css_direction === 'left') ? 
                            that.options.pos_x + amount:
                            that.options.pos_x;

        var desired_pos_y = (css_direction === 'top') ? 
                            that.options.pos_y + amount:
                            that.options.pos_y;

        /***Grid Movement***/
        //Save current position
        var previous_pos_x = that.options.pos_x;
        var previous_pos_y = that.options.pos_y;

        //Move the x or y of the character by 1
        that.options.pos_x = desired_pos_x;
        that.options.pos_y = desired_pos_y;

        /***CSS Movement****/
        //Create the tween object to move the character
        that.options.creep_tween = new Fx.Tween(that.options.element, {
            duration: that.options.move_speed,
            transition: Fx.Transitions.Quad.easeIn
        });

        //Get the current character position, relative to CSS.
        //  This position is not the actual x,y of a character, but the
        //  css property
        var creep_css_position = parseInt(
                that.options.element.getStyle(css_direction), 10);
      
        //Set the amount of CSS pixels to move to the amount * the cell size
        if(cell_size === undefined){
            var cell_size = Zone_Object.options.cell_size;
        }
        var css_amount_to_move = amount * cell_size

        /*:::::::::::::::::::::::::
        //Tween the character and callChain
        *:::::::::::::::::::::::::*/
        that.options.creep_tween.start(css_direction, creep_css_position + 
            css_amount_to_move).chain(function(){
            //The character is done moving in this direction
            that.options.dir_moving[direction] = false;

            //Update the creep's position on the path
            that.options.pos_path += 1;

            //Remove the creep from the cell it previously occupied
            that.remove_from_cell(previous_pos_y, previous_pos_x);

            //Add the creep to the cell the creep occupies
            //  add to cell as i,j 
            that.add_to_cell(that.options.pos_y,that.options.pos_x);
           
            //We're done moving the creep, the chain for creep move is done
            that.options.move_chain.callChain();
        });
        
        /*:::::::::::::::::::::::::
        //Update if creep is selected
        //TODO: Remove for optimization?
        *:::::::::::::::::::::::::*/
        if(Player_Object.options.selected_creep === this){
            this.update_html_active_effects();
        }

        /*:::::::::::::::::::::::::
         *Send request to server
         *:::::::::::::::::::::::::*/
        /*Make the request to the server if the character is the PC*/
        if(that.options.is_pc === true){
            var req = new Request({
                url: url_root + url_character_move,
                data: 'dir=' + direction,
                method: 'post',
                onSuccess: function(res){
                    //If request is successful, no need to do anything
                },
                onFailure: function(res){
                    //If the request failed, move the character back the
                    //  specified amount
                    that.options.element.setStyle(css_direction,
                                        character_position - amount + 'px');
                }
            }).send();   
        }

        //We're done
        //return this;
    },

    //Add a creep to a cell
    add_to_cell: function(i,j){
        //Store a reference to the cell we want
        var cell_object = Zone_Object.options.cell_objects_grid[i][j].options;
        //Add creep to the current cell object's references
        cell_object.contained_creeps.push(
            this);

        var towers_in_range = cell_object.towers_in_range;

        //Check if any towers have a radius that occupies the cell
        //  If the cell falls within a tower's radius, check to see if this 
        //  creep is in that tower's aggro list
        //      If it isn't, push this creep to the aggro list
        if(towers_in_range.length !== 0){
            //Loop through towers in the list
            for(var i=0; i<towers_in_range.length; i++){
                if(towers_in_range[i].options.creep_aggro_array.indexOf(
                            this) === -1){
                    //Add this creep to the tower's aggro list
                    towers_in_range[i].options.creep_aggro_array.push(this);    
                }
            }
        }
        
        //Check if creep has reached the goal
        //TODO: THIS SHOULD BE AN EVENT
        if(i === 25 && j === 26){
            //i,j are the end goal in this case
            this.reached_goal();
        }



    },
    remove_from_cell: function(i,j){
        //Remove the creep from the cell object
        creep_array = Zone_Object.options.cell_objects_grid[i][j].
            options.contained_creeps;
        creep_array.splice(creep_array.indexOf(this), 1);

        //Remove the creep from any towers that no longer are in 
        //  range of the creep
        var cell_object = Zone_Object.options.cell_objects_grid[i][j].options;
        var towers_in_range = cell_object.towers_in_range;

        if(towers_in_range.length !== 0){
            //Loop through towers in the list
            for(var i=0; i<towers_in_range.length; i++){
                if(towers_in_range[i].options.creep_aggro_array.indexOf(
                            this) !== -1){
                    //Remove this creep from the tower's aggro list
                    towers_in_range[i].options.creep_aggro_array.erase(this);    
                }
            }
        }

},

    /*----------------
     * Begin Wave 
     * ---------------*/
    send_to_end: function(){
        //Only call the move chain if the creeps aren't moving to the end
        if(this.options.moving_to_end === false){
            this.options.moving_to_end === true;
            this.options.move_chain.callChain();
        }
        
    }, 
    /*---------------------------------
     * Damage Functions
     * --------------------------------
    /*----------------
     * Take Damage
     * ---------------*/
    take_damage: function(amt, referrer){
        //Pass in an amount to deal damage to creep and
        //  an elemental type
        //TODO: some AC calculations 
        //Only take damage if the health is above 0
        if(Player_Object.options.selected_creep === this){
            this.select_creep();
            this.update_html_active_effects();
        }
        if(this.options.health > 0){
            //Flash the creep
            this.options.element.highlight('#dd2222');

            this.options.health -= amt;
            
            //Check to see if the creep is dead
            if(this.options.health <= 0){
                this.destroy();
                referrer.options.creeps_killed += 1;
                Player_Object.options.creeps_killed += 1;
                return 0;
            }
        }
        return this.options.health;
    },

    /*----------------
     * Destroy Creep 
     * ---------------*/
    destroy: function(){
        //Destroy the creep
        this.options.move_chain.clearChain();
        this.options.element.highlight('#22dddd');
        this.options.element.fade(0);

        //Remove the monster from the list
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Remove the creep from the cell objects grid:
        Zone_Object.options.cell_objects_grid[i][j].options.contained_creeps.erase(this);

        //Give the Player_Object some money
        Player_Object.options.gold += Game_Object.get_creep_value(
                this.options.creep_id);

        $(Player_Object.options.html_gold).highlight('#dddd22');
        $(Player_Object.options.html_gold).set('html', 
                Player_Object.options.gold);

        //Remove creep from selection and update selection box
        if(Player_Object.options.selected_creep === this){
            Player_Object.options.selected_creep = null;
            $(Player_Object.options.html_creep_selected_wrapper).setStyle(
                'opacity',0);
        }
    },

    reached_goal: function(){
        //Destroy the creep
        this.options.move_chain.clearChain();
        this.options.element.highlight('#22dddd');
        this.options.element.fade(0);

        //Remove the monster from the list
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Remove the creep from the cell objects grid:
        Zone_Object.options.cell_objects_grid[i][j].options.contained_creeps.erase(this);

        //health
        Player_Object.options.health -= 1;
        $(Player_Object.options.html_health).highlight('#dd2222');
        //Clear the effected targets list because we'll be rebuilding here
        //        (We don't want duplicate targets)
        $(Player_Object.options.html_health).set('html', Player_Object.options.health);

        //Remove creep from selection and update selection box
        if(Player_Object.options.selected_creep === this){
            Player_Object.options.selected_creep = null;
            $(Player_Object.options.html_creep_selected_wrapper).setStyle('opacity',0);
        }


    }
});
                
                
/*===========================================================================
 *
 * Player Class
 *
=============================================================================*/
/* Create a Player Class.  Stores information about the Player_Object
 */
Player = new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Some Player_Object properties
        health: 20,
        gold: 100,
        elemental_points: 0,

        //Store the mode the Player_Object is in
        //  will be either selection or build
        mode: 'selection',
        selected_tower: null,
        selected_creep: null,

        //Store the names HTML page elements
        html_health: 'player_health_amount',
        html_gold: 'inventory_gold_amount',
        html_elemental_points: 'inventory_element_points_amount',

        html_tower_selected_wrapper: 'tower_selected_wrapper',
        html_creep_selected_wrapper: 'creep_selected_wrapper',

        //Stores a list of towers the Player_Object owns
        towers_owned:[],

        //Stores how many creeps were killed
        creeps_killed:0
    },

    initialize: function(options, Player_Object){
        this.setOptions(options); 
    },

    /*---------------------
     * Update Functions
     * --------------------*/
    update_gold: function(amount){
        //Amount will usually be negative
        this.options.gold += amount;

        //Update the gold text
        $(this.options.html_gold).set('html', this.options.gold);

        //Highlight the gold
        //  Yellow if positive, red if negative
        (amount > 0) ? 
            $(this.options.html_gold).highlight('#dddd22') :
            $(this.options.html_gold).highlight('#22dddd');

    },

    update_selection: function(){
        if(this.options.selected_tower !== null){
            this.options.selected_tower.select_tower();
            return;
        }
        if(this.options.selected_creep !== null){
            this.options.selected_creep.select_creep();
            return;
        }
    }
});
