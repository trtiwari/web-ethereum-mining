package ethash

import (
    "fmt"
    "encoding/json"
    "net/http"
    "log"
    "math/rand"
    )

type PoWResult struct {
    WorkerDigest []byte
    WorkerNonce uint64
    WorkerResult []byte
    
}
var Found bool
var Res PoWResult
var Mux *http.ServeMux
var startIndex int
var indexWidth =  1
var endIndex int
var begin int
var width = indexWidth*16 // width has to be a multiple of 16 bytes
var end int

func StartServer() {
    if (Mux == nil) {
        Mux = http.NewServeMux()
        Mux.HandleFunc("/get", GetRequestHandler)
        Mux.HandleFunc("/post", PostRequestHandler)
        http.ListenAndServe(":9000", Mux)
    }
    Found = false
}


func GetRequestHandler(w http.ResponseWriter, r *http.Request) {
    // this value of 16777186 was taken from https://github.com/ethereum/wiki/wiki/Ethash-DAG
    startIndex = 0 // rand.Intn(16777186)
    endIndex = indexWidth + startIndex
    begin = startIndex*16
    end = begin + width // [begin:end] //startIndex // endIndex
    dataMap := map[string]interface{}{"header":HeaderHash, "cache":CurrentCache,"dag":CurrentDag[begin:end],"startIndex":startIndex,"endIndex":endIndex,"dagSize":len(CurrentDag),"cacheSize":len(CurrentCache)}
    dataMapByteStream,_ := json.Marshal(dataMap)
    w.Write(dataMapByteStream)
}

func PostRequestHandler(w http.ResponseWriter, r *http.Request) {
    if !Found {
        decoder := json.NewDecoder(r.Body)
        err := decoder.Decode(&Res)
        if err != nil {
            log.Printf("verbose error info: %#v", err)
            panic(err)
        }
        fmt.Print("Found Nonce: ")
        fmt.Println(Res.WorkerNonce)
        Found = true
    }
    startIndex = rand.Intn(16777186)
    endIndex = indexWidth + startIndex
    begin = startIndex*16
    end = begin + width
    dataMap := map[string]interface{}{"header":HeaderHash, "cache":CurrentCache,"dag":CurrentDag[begin:end],"startIndex":startIndex,"endIndex":endIndex,"dagSize":len(CurrentDag),"cacheSize":len(CurrentCache)}
    dataMapByteStream,_ := json.Marshal(dataMap)
    w.Write(dataMapByteStream)
}