// GLOBAL VARIABLE
var cart;
var user_lat='', user_lng=''; // user geolocation

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
		_addToCart: function( productname, price, product_geolocation ) {

      // get cart items
			var cart = this.storage.getItem( this.cartName );
			var cartObject = this._toJSONObject( cart );
      var total_items = parseInt( this.storage.getItem(this.total_items) );

      // search existing item
      index_found = -1;
      for (var key in cartObject.items){
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
          "price":this._calculatePrice(price, product_geolocation)
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

		/* Custom price.
		 * @param qty Number the total quantity of items
		 * @returns price
		 */
		_calculatePrice: function( price, product_geolocation ) {
      console.log('product_geolocation:'+product_geolocation);
      coords_array = product_geolocation.split(',');
      product_lat = coords_array[0];
      product_lng = coords_array[1];

      distance = this._calculateDistance(product_lat, product_lng);

			return Math.floor(price*distance);

		},

		/* Calculate distance (in km) based on geolocation.
		 * @param product_lat, product_lng
		 * @returns distance
		 */
		_calculateDistance: function( product_lat, product_lng ) {
      if(user_lat=='' || user_lng=='' || product_lat=='' || product_lng=='')
          return 1 ; // user geolocation is empty

      user_lat = Number(user_lat);
      user_lng = Number(user_lng);
      product_lat = Number(product_lat);
      product_lng = Number(product_lng);

      var deg2rad = function(deg) {
        return deg * (Math.PI/180)
      }

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(product_lat-user_lat);  // deg2rad below
      var dLng = deg2rad(product_lng-user_lng);
      var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(product_lat)) * Math.cos(deg2rad(user_lat)) *
          Math.sin(dLng/2) * Math.sin(dLng/2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      console.log('distance result(km):'+d);

      return d;
		},

  };

})(jQuery);

// thousand separator number
function formatThousandSep(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

function updateCartBadgeIcon(){
  var amount = cart.storage.getItem('total_items')!=null?sessionStorage.getItem('total_items'):0;
  $('.cart_amount').html(amount);
}

function renderProductFinalPrice(){
 $('.product_thumb').each(function(){
   var price = $(this).find('.btn_addcart').data('baseprice');
   var product_geolocation = $(this).find('.btn_addcart').data('geolocation');
   var final_price = formatThousandSep( cart._calculatePrice( price, product_geolocation ) );
   $(this).find('.final_price span').html(final_price);
 });
}

function renderTableRow(){
  var items = [] ;
  if( cart._getObject()!=null){
     items = cart._getObject().items;
  }

  var table_body = $('.cart_container table tbody');
  table_body.empty();

  var total_price = 0;
  items.forEach(function(item, index){
    total_price += (item.price*item.amount);
    var row = '<tr> <th scope="row">'+ (index+1) +'</th> <td>'+ item.productname +'</td> <td>'+ item.amount +'</td> <td>Rp. <span class="subtotal_nominal">'+ (item.price*item.amount) +'</span></td>'
              + '<input type="hidden" name="productname[]" value="' + item.productname + '">'
              + '<input type="hidden" name="amount[]" value="' + item.amount + '">'
              + '<input type="hidden" name="price[]" value="' + item.price + '">'
              + '<input type="hidden" name="subtotal[]" value="' + (item.price*item.amount) + '">'
              + '</tr>';
    table_body.append(row);
  });
  total_price = Math.floor(total_price);
  $('.total_price span.nominal').html(formatThousandSep(total_price));
  $('.input_total_price').val(formatThousandSep(total_price));
}

var userLocationReady;

$(document).ready(function(){
  // Get user geolocation
  userLocationReady = window.navigator.geolocation.getCurrentPosition(function(user_geolocation) {
    console.log('user_geolocation:'+user_geolocation.coords.latitude+','+user_geolocation.coords.longitude);
    user_lng = user_geolocation.coords.longitude;
    user_lat = user_geolocation.coords.latitude;
    renderProductFinalPrice();
  });

  cart = (typeof cart !== "undefined" ? cart : new $.Cart() );

	updateCartBadgeIcon();
  renderTableRow();

  // eventHandler addToCart
  $('.btn_addcart').bind('click', function(e){
    e.preventDefault();

    // show modal
    $('#modal_addcart').find('.modal_content_product').html($(this).data('productname'));
    $('#modal_addcart').modal('show');

    // add product to sessionStorage
    cart._addToCart($(this).data('productname'), $(this).data('baseprice'), $(this).data('geolocation'));

    // update cart total
    updateCartBadgeIcon();
  });

  // eventHandler emptyCart
  $('.btn_emptycart').bind('click', function(e){
    e.preventDefault();

    // show modal
    $('#modal_emptycart').modal('show');

    // empty cart
    cart._emptyCart();
    updateCartBadgeIcon();
    renderTableRow();

  });

  // format nominal price
  $('.nominal, .subtotal_nominal, .nominal_total, .order_nominal').each(function(){
    var nominal = $(this).html();
    $(this).html(formatThousandSep(nominal.replace('.','') ));
  });

});
