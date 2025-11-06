import { Accelerometer } from "expo-sensors";
import React, {useEffect, useState} from "react";
import{View, Alert, Vibration, StyleSheet} from "react-native"

export default function SensorMovimento(){
    // Estado para guardar os valores do sensor (x,y z)
    const [dados, setDados] = useState({x:0, y:0, z: 0})

    useEffect(() => {
        // inicia o sensor de acelerômetro
        const assinatura = Accelerometer.addListener((data) =>{
            // Atualiza os valores lidos pelo sensor (movimento em cada eixo)
            setDados(data)
            // Calcular o movimento 
            const total = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z)
            // Se o valor total for maior que 3 (limite) , o celular foi movimentado  fortemente 
            if(total > 3){
                Vibration.vibrate(300) // faz o celular vibrar por 0,3 segundos
                Alert.alert("Movimento detectado!")
            }
        })
        // Define a frequência da leitura do sensor (a cada 500 milissegundos)
        Accelerometer.setUpdateInterval(500)
        // Quando o componente for fechado, remove o sensor 
        return() => assinatura.remove()
    }, [])
}


