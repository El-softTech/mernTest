# Menghubungkan mongo db atlas dengan backend lalu di hubungkan ke Fronend

# 1 . setup mongo atlas terlebih dahulu
- login dengan email
- add new projek(jika belom pernah buat)
- create new cluster(ikuti semua nya ketika sudah sudah crate deploy)
- ketika sudah klik database accss dan masukan username dan pw dan select role      lalu pilih read and write kemudian add user
- kemudian balik ke cluster lalu conenct pilih driver dan ambil string url nya kaya contoh ini "mongodb+srv://<username>:<db_password>@cluster0.4w94l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

- jika ingin membuat database dan collction klik browse collection lalu add database dan isi nama data base dan colection

# 2. setup  mongo atlas backend 
- pertama  buat di root file .env untuk menyimpen link url 
- buat folder Config dan buat file dengan nama db.js yang berfungsi untuk menghubungkan backend dengan mongo atlas
- buat juga folder models dan buat skema untuk db nya nant,misal  bisa berisi nama,nim ,alamt 

- ini adalah hasil dari model yang udh jadi const Todo = mongoose.model("Task", TodoSchema); 

    ***"Todo" nanti untuk di export dan di letakan ke root agar bisa mengakses data base nya 

    ***"Task" ini nanti buat collection nya kalo belom ada collection Task maka akan di buatkan sebuah collection yang  jamak yaitu Tasks dengan tambahan s

    ***kemudain TodoSchema adalah template yang  nanti bisa di isi objek cara buat nya gini

    const TodoSchema = new mongoose.Schema({
    nama: {
     type: String,
     required: true
    },
    
        });

    panggil mongoose lalu cari schema  dalam nya buat objek yang berisi  data apa yang mau di masukin misal nya "nama" kaya di contoh  nanti type nya itu string dan requaired true berarti wajib di isi 

    
    











