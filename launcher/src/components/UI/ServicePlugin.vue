 <template>
    <div id="parent">
        <div class="servicePlg">
            <div class="servicePlgTitle"> service plugins</div>
            <div class="serviceCtrl">
                ServicePlugin
            </div>
        </div>
    </div>
</template> 
<style>
    .servicePlg{
    background: blue;
  border: 3px solid #808080;
  width: 20%;
  height: 88%;
  right: 14.5%;
  box-sizing: border-box;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: 8.5%;
  padding: .3rem;
    }
    .servicePlgTitle{
        padding: .5rem;
        background: chocolate;
        width: 100%;

    }
    .serviceCtrl{
        
        width: 95%;
        height: 92%;
        background: chartreuse;
border-radius: 40px;
    }
</style>