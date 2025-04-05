// Script xử lý active state cho sidebar 
document.querySelectorAll('.custom-hover').forEach(item => {
    item.addEventListener('click', function() {
         //Xóa active ở tất cả các sidebar item
     document.querySelectorAll('.custom-hover').forEach(el => {
       el.classList.remove('active');
      });
      //Thêm active vào item được nhấp
      this.classList.add('active');    });
   });
 