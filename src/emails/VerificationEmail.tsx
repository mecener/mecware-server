import { Body, Container, Head, Html, Img, Link, Section, Text } from "@react-email/components";

interface VerificationEmailProps {
	link: string;
	username: string;
}

export const VerificationEmail = ({ link, username }: VerificationEmailProps) => (
	<Html>
		<Head />
		<Body style={{ fontFamily: "Arial, sans-serif" }}>
			<Container>
				<Img
					src="https://raw.githubusercontent.com/mecener/mecware-client/refs/heads/master/src/assets/logo.svg"
					alt="Logotype"
					width="100"
					height="100"
				/>
				<Section>
					<Text>Hi, {username}!</Text>
					<Text>Please confirm your email address by clicking on the link below:</Text>
					<Link href={link}>Confirm account</Link>
					<Text>If you haven't registered on our website, just ignore this email.</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);
