const cl=console.log;

const showmodal=document.getElementById("showmodal");
const productContainer=document.getElementById("productContainer");
const backDrop=document.getElementById("backDrop");
const productModal=document.getElementById("productModal");
const nameControl=document.getElementById("productname");
const discriptionControl=document.getElementById("discription");
const imgUrlControl=document.getElementById("imgUrl");
const statusControl=document.getElementById("status");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");
const productform=document.getElementById("productform");
const loader=document.getElementById("loader");

const closemodal=[...document.querySelectorAll(".closemodal")];

let baseUrl=`https://batch12-fetch-posts-default-rtdb.asia-southeast1.firebasedatabase.app`;

let postUrl =`${baseUrl}/posts.json`;

const snackBarMsg=(msg,iconName,time)=>{
   Swal.fire({
    title:msg,
    icon:iconName,
    timer:time
   })
}

const objToarr=(obj)=>{
    let arr=[];
    for(const key in obj){
        arr.push({...obj[key],id:key})
    }
    return arr
}

const templating =(arr)=>{
    productContainer.innerHTML=arr.map(obj=>{
        return`
        <div class="col-md-4">
        <div class="card mb-4">
        <figure class="productcard mb-0" id="${obj.id}">
            <img src="${obj.imgUrl}" alt="">
        <figcaption>
            <div class="ratingsection">
                <div class="row">
                    <div class="col-sm-7">
                        <h2>${obj.productname}</h2>
                    </div>
                    <div class="col-sm-5 d-flex align-items-center bg-warning text-dark h4">
                       ${obj.status} 
                    </div>
                </div>
            </div>
            <div class="overviewsection">
                <h3>${obj.productname}</h3>
                <p>"${obj.discription}"</p>
                <div class="action d-flex justify-content-between">
                <button type="button" class="btn btn-primary" onclick="onProductEdit(this)">Edit</button>
                <button type="button" class="btn btn-danger" onclick="onProductDelete(this)">Delete</button>
                </div>
            </div>
        </figcaption>     
        </figure>
    </div>
     </div>   
        `
    }).join("")
}
const addProductcard=(obj)=>{
    let card=document.createElement("div");
    card.id=obj.id;
    card.className ="col-md-4";
    card.innerHTML=`
    <div class="card mb-4">
    <figure class="productcard mb-0" id="${obj.id}">
        <img src="${obj.imgUrl}" alt="">
    <figcaption>
        <div class="ratingsection">
            <div class="row">
                <div class="col-sm-7">
                    <h2>${obj.productname}</h2>

                </div>
                <div class="col-sm-5 d-flex align-items-center bg-warning text-dark h4">

                    ${obj.status}
                </div>
            </div>
        </div>
        <div class="overviewsection">
            <h3>${obj.productname}</h3>
            <p>${obj.discription}</p>
            <div class="action d-flex justify-content-between">
            <button type="button" class="btn btn-primary" onclick="onProductEdit(this)">Edit</button>
            <button type="button" class="btn btn-danger" onclick="onProductDelete(this)">Delete</button>
            </div>
        </div>
    </figcaption>     
    </figure>
</div>
    `
    productContainer.prepend(card)
}

const makeApicall=async(apiUrl,methodName,msgBody=null)=>{
       try{
        if(msgBody) {
            msgBody=JSON.stringify(msgBody)
        }
        loader.classList.remove("d-none")
         let res= await fetch(apiUrl,{
            method:methodName,
            body:msgBody
       })
       return res.json()
        }catch(err){
            cl(err)
        }
        finally{
            loader.classList.add("d-none")
        }
}

       
const modalBackdropToggle=()=>{
    backDrop.classList.toggle("active");
    productModal.classList.toggle("active");
    productform.reset()
}

showmodal.addEventListener("click",modalBackdropToggle);
closemodal.forEach(btn=>{
    btn.addEventListener("click",modalBackdropToggle)
})

const onProductAdd= async(e)=>{
    try{
    e.preventDefault();
   let obj={
    productname:nameControl.value,
    discription:discriptionControl.value,
    imgUrl:imgUrlControl.value,
    status:statusControl.value
   }
   cl(obj)
   let res = await makeApicall(postUrl,"POST",obj)
     cl(res)
     obj.id=res.name;   
     addProductcard(obj)
     snackBarMsg(`The product ${obj.productname} is Added successfully`,`success`,2500);
     

   }
   catch(err){
    cl(err)
    snackBarMsg(`Something went wrong`,`error`,2500);

   }
   finally{
    productform.reset()
    modalBackdropToggle()

   }


}

const fetchProduct =async()=>{
   try{
    let data= await makeApicall(postUrl,"GET",null)
    let array = objToarr(data)
    templating(array.reverse())
   }
   catch(err){
    cl(err)
   }
   finally{

   }
}
fetchProduct()

const onProductEdit=async(ele)=>{
  try{
    let editId = ele.closest(".productcard").id;
    cl(editId)
    localStorage.setItem("editId",editId)
    let editUrl =`${baseUrl}/posts/${editId}.json`
    cl(editUrl)
   let res = await makeApicall(editUrl,"GET")
   modalBackdropToggle()
   nameControl.value = res.productname
   discriptionControl.value=res.discription
   imgUrlControl.value=res.imgUrl
   statusControl.value=res.status
   updatebtn.classList.remove("d-none")
   submitbtn.classList.add("d-none")
   
  }
  catch(err){
    cl(err)
  }
}

const onUpdateMovie =async(ele)=>{
  try{
    let updatedId=localStorage.getItem("editId");
    cl(updatedId)
    let updatedUrl=`${baseUrl}/posts/${updatedId}.json`
    cl(updatedUrl)
    let updatedobj={
     productname:nameControl.value,
     discription:discriptionControl.value,
     imgUrl:imgUrlControl.value,
     status:statusControl.value,
     id:updatedId
    }
    cl(updatedobj)
    modalBackdropToggle()
   let res=await makeApicall(updatedUrl,"PATCH",updatedobj)
   cl(res)
   let card=document.getElementById(updatedId)
   cl(card)
   card.innerHTML=`
   <div class="card mb-4">
   <figure class="productcard mb-0" id="${updatedobj.id}">
       <img src="${updatedobj.imgUrl}" alt="">
   <figcaption>
       <div class="ratingsection">
           <div class="row">
               <div class="col-sm-7">
                   <h2>${updatedobj.productname}</h2>
               </div>
               <div class="col-sm-5 d-flex align-items-center bg-warning text-dark h4">
                   ${updatedobj.status}
               </div>
           </div>
       </div>
       <div class="overviewsection">
           <h3>${updatedobj.productname}</h3>
           <p>${updatedobj.discription}</p>
           <div class="action d-flex justify-content-between">
           <button type="button" class="btn btn-primary" onclick="onProductEdit(this)">Edit</button>
           <button type="button" class="btn btn-danger" onclick="onProductDelete(this)">Delete</button>
           </div>
       </div>
   </figcaption>     
   </figure>
</div>
   `
   updatebtn.classList.add("d-none")
   submitbtn.classList.remove("d-none")
   productform.reset()
   snackBarMsg(`The product ${updatedobj.productname} is Updated successfully`,`success`,2500);


  }
  catch(err){
    cl(err)
    snackBarMsg(`Something went wrong`,`error`,2500);

  }
  finally{

  }
}

const onProductDelete =async(ele)=>{
 try{
   let result= await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      })
        if (result.isConfirmed) {
            let editId = ele.closest(".productcard").id;
            cl(editId)
            let deleteUrl=`${baseUrl}/posts/${editId}.json`
            cl(deleteUrl)
            let res=await makeApicall(deleteUrl,"DELETE");
            cl(res)
            ele.closest(".col-md-4").remove()
        }
   
 }
 catch(err){
    cl(err)
 }
 finally{

 }
}   

productform.addEventListener("submit",onProductAdd)
updatebtn.addEventListener("click",onUpdateMovie)