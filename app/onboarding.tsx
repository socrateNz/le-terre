
import { useAppStore } from '@/store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const { setOnboardingCompleted } = useAppStore();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const carr = [
        {
          title: 'Bienvenue sur Le Terre',
          description: 'Le Terre est un jeu de dés qui vous permet de gagner de l\'argent en jouant contre d\'autres joueurs.',
          image: require('@/assets/images/carr1.webp'),
        },
        {
          title: 'Comment ça marche ?',
          description: 'Vous pouvez jouer contre d\'autres joueurs en ligne. Vous pouvez gagner de l\'argent en jouant contre d\'autres joueurs.',
          image: require('@/assets/images/carr2.webp'),
        },
        {
          title: 'Dépot et retrait',
          description: 'Vous pouvez recharger votre compte en utilisant MTN Money ou Orange Money. Les retrait sont instantanés',
          image: require('@/assets/images/carr3.webp'),
        },
      ];

    const handleNext = () => {
        if (currentIndex === carr.length - 1) {
            handleDone();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleDone = () => {
        setOnboardingCompleted(true);
    };

    const currentSlide = carr[currentIndex];

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#005A9A" barStyle="light-content" />

            {/* Image qui occupe 2/3 de l'écran */}
            <View style={styles.imageContainer} className='relative'>
                
                <Image
                    source={currentSlide.image}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Dégradé en bas de l'image */}
                <LinearGradient
                    colors={['#005A9A10', '#005A9A20', '#005A9A']}
                    locations={[0, 0.7, 1]}
                    style={styles.gradient}
                />
            </View>

            {/* Contenu en bas - 1/3 de l'écran */}
            <View style={styles.contentContainer}>

                {/* Indicateur de page */}
                <View style={styles.indicatorContainer}>
                    {carr.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentIndex === index && styles.indicatorActive
                            ]}
                        />
                    ))}
                </View>

                <View className='flex flex-col gap-2'>
                    {/* Titre */}
                    <Text style={styles.title}>{currentSlide.title}</Text>
                    {/* Sous-titre */}
                    <Text style={styles.description}>{currentSlide.description}</Text>
                </View>

                {/* Bouton unique */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === carr.length - 1 ? "Commencer" : "Suivant"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#005A9A',
        paddingBottom: 32,
    },
    imageContainer: {
        height: height * 0.61, 
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        alignSelf: 'center'
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 1.5, 
    },
    contentContainer: {
        flex: 1, 
        paddingHorizontal: 32,
        paddingBottom: 50,
        justifyContent: 'space-between',
        backgroundColor: '#005A9A1A',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: 16,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        opacity: 0.3,
        marginHorizontal: 4,
    },
    indicatorActive: {
        opacity: 1,
        width: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 12,
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#EDF2F7',
        width: 358,
        marginHorizontal: "auto",
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#005A9A',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
});