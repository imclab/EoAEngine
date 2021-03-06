'''==========================================================================
                                                                                                       
Map.py

Map class that handles the world and game grid
============================================================================='''
from custom_exceptions import *
import Cell
'''========================================================================

Map

There will really only be one zone 'object' per game (for now)

==========================================================================='''
class Map(object):
    '''Stores information about the game grid, zone, and cells'''

    def __init__(self, name='Map_01'):
        '''Store some info about the map.  A lot of stuff we don't need,
            like the info on who created the map and whatnot.  For now,
            we'll assume a basic map'''

        #Define the grid the map will use.
        #   0 is unbuildable
        #   1 is tower buildable area
        self.grid = [
            [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
        ]

        #Defind the path the creeps will take
        self.creep_path = [ #Top Left > Down
            [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],
            [1,10], [1,11],[1,12],[1,13],[1,14],[1,15],[1,16],[1,17],
            #Bottom Left > Right
            [2,17],[3,17],[4,17],[5,17],[6,17],[7,17],[8,17],
            #Middle Left > Up
            [8,16],[8,15],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[8,8],
            [8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
            #Top Middle > Right
            [9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],
            #Right Middle > Down
            [16,1],[16,2],[16,3],[16,4],[16,5],[16,6],[16,7],[16,8],
            [16,9],[16,10],[16,11],[16,12],[16,13],[16,14],[16,15],
            [16,16],[16,17],
            #Right Bottom > Right
            [17,17],[18,17],[18,17],[19,17],[20,17],[21,17],[22,17],
            [23,17],[24,17],
            #Right Bottom > Top Right (To Goal)
            [24,16],[24,15],[24,14],[24,13],[24,12],[24,11],[24,10],
            [24,9],[24,8],[24,7],[24,6],[24,5],[24,4],[24,3],[24,2],
            [24,1],[24,0]
        ] 

        #Store a list of cell objects (generated from create_cells())
        self.cell_objects = [[]]
        #Call function to create the cells for the map
        self.create_cells()

        #Store a list of creep
        self.creep_list = []
        
    '''=====================================================================

    Methods

    ========================================================================'''
    def create_cells(self):
        '''create_cells
        Creates a matrix of cell objects based on the map grid'''
        self.cell_objects = [[]]

        #Loop through the grid and create a cell object for each cell
        for i in range(len(self.grid)):
            for j in range(len(self.grid[i])):
                #Add a cell object to the map's cell object list for each cell
                #   in the map's grid
                self.cell_objects[i].append(Cell.Cell(pos_x=j, pos_y=i, 
                        cell_value=self.grid[i][j]))
            #Add a list for the next row
            self.cell_objects.append([])


