// GLOBAL VARIABLE
var cart;

/* Create Cart Object
* properties:
*   items
*   total_items
*   total_price
* method:
*   addToCart
*/

(function( $ ) {
  $.Cart = function() {
    this.init();
  };

  $.Cart.prototype = {
    init:function(){
      // properties
      this.cartName = 'kereta_belanja';
      this.total_items = 'total_items';
      this.total_price = 'total_price';
      this.storage = sessionStorage; // shortcut to the sessionStorage object

      // Method invocation
      this.createCart();
    },

    // Creates the cart keys in the session storage
		createCart: function() {
			if( this.storage.getItem( this.cartName ) == null ) {

				var cart = {};
				cart.items = [];

				this.storage.setItem( this.cartName, this._toJSONString( cart ) );
				this.storage.setItem( this.total_items, "0" );
				this.storage.setItem( this.total_price, "0" );
			}
		},

    // Private methods

		// Empties the session storage
		_emptyCart: function() {
			this.storage.clear();
		},

		/* Converts a JSON string to a JavaScript object
		 * @param str String the JSON string
		 * @returns obj Object the JavaScript object
		 */
		_toJSONObject: function( str ) {
			var obj = JSON.parse( str );
			return obj;
		},

		/* Converts a JavaScript object to a JSON string
		 * @param obj Object the JavaScript object
		 * @returns str String the JSON string
		 */
		_toJSONString: function( obj ) {
			var str = JSON.stringify( obj );
			return str;
		},

		/* Add an object to the cart as a JSON string
		 * @param values Object the object to be added to the cart
		 * @returns void
		 */
		_addToCart: function( productname ) {

      // get cart items
			var cart = this.storage.getItem( this.cartName );
			var cartObject = this._toJSONObject( cart );
      var total_items = parseInt( this.storage.getItem(this.total_items) );

      console.log(cartObject);
      // search existing item
      index_found = -1;
      for (var key in cartObject.items){
        console.log(key);
        console.log(cartObject.items[0]);
        if(cartObject.items[key].productname.indexOf(productname)!=-1){
          index_found = key;
          break;
        }
      }

      if(index_found!=-1){ // product already exist, increment amount
        cartObject.items[index_found].amount += 1;
      }else{ // create new
        var item = {
          "productname":productname,
          "amount":1,
        }
			  cartObject.items.push( item );
      }

      // increment total_items
      total_items += 1;

			this.storage.setItem( this.cartName, this._toJSONString( cartObject ) );
			this.storage.setItem( this.total_items, total_items );
		},

    /* Get object representation of cart items */
		_getObject: function( ) {
			return this._toJSONObject( this.storage.getItem( this.cartName ) );

		},

		/* Custom price based on location of product relative to user location
		 * @param qty Number the total quantity of items
		 * @returns price
		 */
		_calculatePrice: function( qty, product_location ) {
			var price = 0;

			return price;

		},

  };

})(jQuery);

function updateCartBadgeIcon(){
  var amount = cart.storage.getItem('total_items')!=null?sessionStorage.getItem('total_items'):0;
  $('.cart_amount').html(amount);
}

function renderTableRow(){
  var items = [] ;
  if( cart._getObject()!=null){
     items = cart._getObject().items;
  }

  var table_body = $('.cart_container table tbody');
  table_body.empty();

  items.forEach(function(item, index){
    var row = '<tr> <th scope="row">'+ (index+1) +'</th> <td>'+ item.productname +'</td> <td>'+ item.amount +'</td> <td>Rp.'+ 2000 +'</td> </tr>';
    table_body.append(row);
  });
}

$(document).ready(function(){
  cart = (typeof cart !== "undefined" ? cart : new $.Cart() );

	updateCartBadgeIcon();
  renderTableRow();

  // eventHandler addToCart
  $('.btn_addcart').bind('click', function(e){
    e.preventDefault();

    // show modal
    $('#modal_addcart').find('.modal_content_product').html($(this).data('productname'));
    $('#modal_addcart').modal('show');

    /*
    * items : [
    *     {"name":"Apple","amount":3}
    *     {"name":"Jeruk","amount":2}
    * ]
    */

    // add product to sessionStorage
    cart._addToCart($(this).data('productname'));

    // update cart total
    updateCartBadgeIcon();

    // calculate total items & price

    console.log($(this).data('productname'));
    console.log($(this).data('geolocation'));
  });

  // eventHandler emptyCart
  $('.btn_emptycart').bind('click', function(e){
    e.preventDefault();

    // show modal
    $('#modal_emptycart').modal('show');

    /*
    * items : [
    *     {"name":"Apple","amount":3}
    *     {"name":"Jeruk","amount":2}
    * ]
    */

    // empty cart
    cart._emptyCart();
    updateCartBadgeIcon();
    renderTableRow();

  });

});
