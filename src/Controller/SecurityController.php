<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class SecurityController extends AbstractController
{
    #[Route('/login', name: 'app_login')]
    public function login(Request $request): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        $error = null;
        if ($request->isMethod('POST')) {
            $email = $request->request->get('email');
            $password = $request->request->get('password');

            $user = $this->getDoctrine()
                ->getRepository(User::class)
                ->findOneBy(['email' => $email]);

            if ($user && password_verify($password, $user->getPassword())) {
                // Simple session-based authentication
                $request->getSession()->set('user_id', $user->getId());
                $request->getSession()->set('user_email', $user->getEmail());
                $request->getSession()->set('user_roles', $user->getRoles());

                return $this->redirectToRoute('app_home');
            } else {
                $error = 'Invalid email or password.';
            }
        }

        return $this->render('security/login.html.twig', [
            'error' => $error,
        ]);
    }

    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        $error = null;
        if ($request->isMethod('POST')) {
            $email = $request->request->get('email');
            $password = $request->request->get('password');
            $firstName = $request->request->get('firstName');
            $lastName = $request->request->get('lastName');

            // Check if user already exists
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
            if ($existingUser) {
                $error = 'User with this email already exists.';
            } else {
                $user = new User();
                $user->setEmail($email);
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setPassword($passwordHasher->hashPassword($user, $password));
                $user->setRoles(['ROLE_USER']);

                $entityManager->persist($user);
                $entityManager->flush();

                $this->addFlash('success', 'Registration successful! Please log in.');
                return $this->redirectToRoute('app_login');
            }
        }

        return $this->render('security/register.html.twig', [
            'error' => $error,
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(Request $request): Response
    {
        $request->getSession()->clear();
        return $this->redirectToRoute('app_home');
    }
}