<style >
*{
    box-sizing:border-box;
}    
.month {
    padding: 70px 25px;
    width: 100%;
    background: #1abc9c;
}
.month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
}
.month .prev {
    float: left;
    padding-top: 10px;
}

.month .next {
    float: right;
    padding-top: 10px;
}

</style>
<template>
<div class="month">      
  <ul>
    <li class="prev">&#10094;</li>
    <li class="next">&#10095;</li>
    <li style="text-align:center">
      <slot name="monthName"></slot><br>
      <span style="font-size:18px"><slot name="year"></slot></span>
    </li>
  </ul>
</div>

</template>
<script>
    export default
    {

    }
</script>