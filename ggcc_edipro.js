import axios from 'axios'
import { getDocument } from "pdfjs-dist";





export async function ggcc_edipro(user,id,password){
try{

  /* dotenv.config();

  const USERS=JSON.parse(process.env.USERS)

  const Userfound = USERS.find(function(elemento) {
    return elemento.user == user;
  });
  
  let password=0
  if (Userfound) {
    password=Userfound.password
  } else {
    return {
      data: [
        {
          invoice_amount: "Usuario no registrado",
        },
      ],
    };
  } */
  

const response = await axios.post("https://app.edipro.app/api/v2/sessions/new",{
  "email": user,
  "password": password
})

const token=response.data.auth_token


const communities = await axios.get("https://app.edipro.app/api/v2/users/comunidades", {
  headers: {
    'Authorization-Token':token
  }
});

const comunidad=communities.data.comunidades

// const id='b-518'

const Oneproperty= await axios.get(`https://app.edipro.app/api/v2/copropiedades/${id}`,{
  headers:{
    'Authorization-Token':token,
    'Comunidad':comunidad
  }
})

const invoice_amount=Oneproperty.data.deuda_total

const Colillas= await axios.get(`https://app.edipro.app/api/v2/colillas?copropiedad_id=${id}&emitida=true`,{ // 1210B
  headers:{
    'Authorization-Token':token,
    'Comunidad':comunidad,
  }
})

// PDF Data extractor
const obtenerTextoPDFEnSitio = async (url) => {
  const loadingTask = getDocument(url);

  try {
    const pdfDocument = await loadingTask.promise;


    const page = await pdfDocument.getPage(1);

    const textContent = await page.getTextContent();

    const textoPagina = textContent.items[42].str
    return textoPagina
  } catch (error) {
    console.error("Error:", error);
  }
};

const urlSitioConPDF = Colillas.data.colillas[0].colilla
const info= await obtenerTextoPDFEnSitio(urlSitioConPDF);
const last_payment_amount=parseInt(info.substring(1,info.indexOf(',')).replace('.',''))
const last_payment_date=info.substring(info.indexOf(',')+2,info.indexOf(', N')).split("/").reverse().join("-")


return{
  data:
    {
      invoice_amount,
      last_payment_amount,
      last_payment_date
    }
}

} catch{
  return {
    data: 
      {
        invoice_amount: "Error al cargar página",
      }
  };
}}


export default ggcc_edipro;