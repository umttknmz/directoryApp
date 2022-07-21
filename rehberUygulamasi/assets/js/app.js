const form = document.getElementById('form-rehber');
form.addEventListener('submit', save)
const inputName = document.getElementById('ad');
const inputSurname = document.getElementById('soyad');
const inputMail = document.getElementById('mail');
const tbody = document.querySelector('.kisi-listesi');
const savedBtn = document.querySelector('#kaydet');
const hr = document.querySelector('.bilgii');
const tTemizle = document.getElementById('tTemizle');
tTemizle.addEventListener('click', clear);
// document.addEventListener('DOMContentLoaded', localStrogeList);

let persons = []; //Kişilerin değerlerini saklamak için bir dizi oluşturuyorum. Dizide id kısmını ekledim çünkü id kısmına göre gümcelleme silme işlemlerini yapacagım arka planda dizi içerisinde id olacak ama tablo kısmnda gözükmeyecektir.

if (localStorage.getItem('persons') !== null) {
    persons = JSON.parse(localStorage.getItem('persons'));
}
  
addTable();

let editId;
let isEdit = false;

function save(e) {
    e.preventDefault();
    const messageDiv = document.createElement('div'); // Uyarı mesajları vememiz için oluşturulan div
    if (inputName.value != "" && inputSurname.value != "" && inputMail.value != "") { // input içerinde değer yok ise boş geçilmemesi için uyarı verdiriyoruz.
        if (!isEdit) {
            //Ekleme yapılacak yer
            persons.push({ 'id': persons.length + 1, 'name': inputName.value, 'surname': inputSurname.value, 'mail': inputMail.value }); //Diziye key ve value leri ile birlikte tutması için persons dizisine aktarıyorum.
            messageDiv.textContent = "Kayıt Başarılıdır."; //Mesaj divinin içerisinde yazacagı text'i yazdırıyorum.
            messageDiv.className = "bilgi"; //hangi classı alagını ekliyorum 
            messageDiv.classList.add('bilgi--success'); // birden fazla class oldugu için class list ile bir class daha ekliyorum.
            document.querySelector(".container").insertBefore(messageDiv, form);
            deleteDiv(); // bu fonksiyonu çagırıyorum çünkü belli bir süre sonra çıkan divin kaybolmasını istiyorum.
            inputValueDelete(); // input textlerin içerisinde yazan değeri boşaltması için çagırdıgım fonksiyon
            document.querySelector('.kisi-listesi').innerHTML = ""; // tablo yapısını bozmaması ve üzerine tekrar yazmaması için tbody deki verileri sıfırlayıp addtable fonksiyonu ile yenileniş şekilde çagırıyorum.
            addTable(); // tablo ekledigimiz fonksiyonu tekrar çagırıyorum.
        } else {
            //Güncelleme yapılacak yer
            for (let person of persons) {
                if (person.id == editId) {
                    person.name = inputName.value;
                    person.surname = inputSurname.value;
                    person.mail = inputMail.value;
                    document.querySelector('.kisi-listesi').innerHTML = "";
                    addTable();
                }
                isEdit = false;
                savedBtn.value = "Kaydet";
            }
            inputValueDelete();
        }
        localStrogeSave();
    } else {
        messageDiv.textContent = "Boş alan bırakılamaz!";
        messageDiv.className = "bilgi";
        messageDiv.classList.add('bilgi--error');
        document.querySelector(".container").insertBefore(messageDiv, form);
        deleteDiv();
    }
}

function addTable() {
    for (let person of persons) {
        let trTag = `
            <tr class='eklenenTr'>
                <th>${person.name}</th> 
                <th>${person.surname}</th>
                <th>${person.mail}</th>
                <th>
                    <button onclick='btnEdit(${person.id},"${person.name}","${person.surname}","${person.mail}")' class="btn btn--edit"><i class="far fa-edit"></i></button>
                    <button onclick='btnTrash(${person.id})' class="btn btn--trash"><i class="far fa-trash-alt"></i></button>
                </th>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", trTag); //beforeend => hep aşagıdaki durumu baz alarak bir sonraki şeklinde devam eder.
        
    }
}

function deleteDiv() {
    setTimeout(() => {
        document.querySelector('.bilgi').remove();
    }, 1000);

}

function inputValueDelete() {
    form.reset(); //form içerisin de input değerlerini boşaltmamıza yarıyor.
}

function btnTrash(id) {
    let deleteId;
    for (let person in persons) {
        if (persons[person].id == id) {
            deleteId = person;
        }
    }
    persons.splice(deleteId, 1);
    document.querySelector('.kisi-listesi').innerHTML = "";
    addTable();
    localStrogeSave();
}

function btnEdit(id, name, surname, mail) {
    editId = id; // id durumuna göre güncelleyecegimiz için parametreden gelen id yi kendi tanımladıgım editId değişkenine atıyorum.
    isEdit = true; // isEdit adında bir değişken tanımladım durumunu false olarak verdim ancak güncelleme durumunda true dönderdim bunun sebebi tukarıda ekle fonsiyonunda karışıklıga sebep olmasın diye bunu if else ile ayırdım.
    inputName.value = name; // name parametresinden gelen değeri inputText deperine atıyorum. 
    inputSurname.value = surname; // surname parametresinden gelen değeri inputText deperine atıyorum. 
    inputMail.value = mail; // mail parametresinden gelen değeri inputText deperine atıyorum. 
    savedBtn.value = "Update"; // burada ekle butonun içinde yazan value değerini güncelliyorum. 
}

function clear() {
    persons.splice(0, persons.length); // dizi içerisinde ki length durumu 0 dan dizinin uzunlugu kadar seçtirip tüm hepsini silme işlemi yaptırıyorum.
    localStrogeSave();
    document.querySelector('.kisi-listesi').innerHTML = "";
    addTable();
}

function localStrogeSave() {
    localStorage.setItem('persons', JSON.stringify(persons));
}
