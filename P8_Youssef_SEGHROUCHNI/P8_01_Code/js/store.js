/**
 * Creates a new Store.
 * @class string Store
 */
(function (window) {
	'use strict';


	/**
	 * Crée un nouvel objet de stockage côté client et crée un espace vide si aucun stockage existe.
	 * @constructs Store
	 * @param {string} (name) Le nom de notre DB que nous voulons utiliser.
	 * @param {function} (callback) La fonction de rappel.
	 */
	function Store(name, callback) {
		callback = callback || function () {};
		this._dbName = name; 

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}


	/**
	 * Trouve les éléments basés sur une requête donnée en tant qu'objet JS
	 * @param {object} (query) La requête à comparer (c'est-à-dire {foo: 'bar'})
	 * @param {function} (callback) La fonction de rappel à déclencher lorsque l' exécution
	 * de la requête est terminée.
	 * @function find  
	 */
	Store.prototype.find = function (query, callback) {
	    if (callback) {
	        var todos = JSON.parse(localStorage[this._dbName]).todos;
	        callback.call(
	            this,
	            todos.filter(function(todo) {
	                for (var q in query) {
	                    if (query[q] !== todo[q]) {
	                        return false;
	                    }
	                }
	                return true;
	            })
	        );
	    }
	};


	/**
	 * Récupére toutes les données.
	 * @param {function} (callback) La fonction de rappel lors de la récupération des données.
	 * @function findAll  
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};


	/**
	 * Sauvegarde les données dans la BD. Si aucun élément n'existe, un nouvel élément
	 *  sera créé, sinon une mise à jour des propriétés de l' élément existant sera réalisée.
	 * @param {object} (updateData) Les données à sauvegarder dans la base de données
	 * @param {function} (callback) La fonction de rappel après l'enregistrement
	 * @param {number} (id) Un paramètre facultatif correspondantà l' identifiant d'un élément
	 *                      à mettre à jour
	 * @function save  
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		// If an ID was actually given, find the item and update each property
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {

    		// Assign an ID
			updateData.id = Date.now();

			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
    };


	/**
	 * Retire un élément en fonction de son ID.
	 * @param {number} (id) L'identifiant de l'objet que vous souhaitez supprimer.
	 * @param {function} (callback) Le callback après l'enregistrement.
	 * @function remove  
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};


	/**
	 * Commence un nouveau stockage
	 * @param {function} (callback) La fonction de rappel après avoir déposé les données
	 * @function drop  
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};


	// Exporte vers Window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
