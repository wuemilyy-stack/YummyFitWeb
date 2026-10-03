import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/sections/Footer';
import { POLICY_VERSION } from '../../shared/contracts';
import { site, sitePath } from '@/config/site';
const content = {
  privacy: { title: 'Privacy Policy', sections: [
    ['What we collect', 'The waitlist collects your name, email address, price preference, optional membership interest, and email-update preference. Newsletter signup collects your email and consent. We record the policy version and signup time. Please do not submit medical information.'],
    ['How we use it', 'We use signup information to prepare the YummyFit launch and understand interest in memberships and pricing. We send optional marketing updates only when you have opted in. We do not sell signup information.'],
    ['Service providers', 'Website and database hosting providers process information to operate the service. Google Fonts receives normal connection information when your browser requests a font.'],
    ['Retention and your choices', 'We retain signup information while needed for launch preparation and opted-in communications. You may request access, correction, deletion, or withdrawal of marketing consent through our contact channel. Requests must be verified before records are changed.'],
    ['Security', 'We limit access to signup records and use validation and technical safeguards. No internet service can guarantee complete security.'],
  ] },
  terms: { title: 'Terms of Use', sections: [
    ['Pre-launch service', 'YummyFit is preparing for launch. This website describes planned features. Availability, final prices, and membership benefits may change. Joining the waitlist does not create a paid subscription, guarantee availability, or reserve a paid membership.'],
    ['Your signup', 'Provide an email address you control and accurate information. Do not submit sensitive health information or use the forms to impersonate another person. Duplicate signups are accepted without changing the original record.'],
    ['Health information', 'Product descriptions are general information. They do not provide medical advice, diagnosis, or individualized treatment.'],
    ['Acceptable use', 'Do not disrupt the website, send abusive automated requests, or attempt to access another person’s signup information.'],
    ['Changes', 'We may update these terms as the service develops. The version shown below identifies the terms acknowledged during signup.'],
  ] },
  cookies: { title: 'Cookie Policy', sections: [
    ['Current website', 'The current signup forms do not use advertising or analytics cookies and do not store signup information in browser local storage.'],
    ['Third-party fonts', 'The site requests fonts from Google Fonts. Those requests share normal network information with the font provider. You can control third-party requests through your browser settings.'],
    ['Future changes', 'If the website introduces optional tracking, this policy and any necessary consent controls will be updated before that tracking is enabled.'],
  ] },
};
export function Legal({ page }: { page: keyof typeof content }) {
  const document = content[page];
  return <><Navigation /><main id="top" className="container-custom max-w-3xl pt-28 pb-16">
    <h1 className="text-4xl font-bold mb-3">{document.title}</h1><p className="mb-8">Policy version: {POLICY_VERSION}</p>
    {document.sections.map(([heading, text]) => <section key={heading} className="mb-6"><h2 className="text-xl font-semibold mb-2">{heading}</h2><p>{text}</p></section>)}
    <h2 className="text-xl font-semibold mb-2">Contact</h2>
    {site.contactEmail ? <p>Contact <a className="underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with questions or privacy requests.</p>
      : <p><a className="underline" href={site.contactUrl}>Request private contact with the project maintainer</a> for support or privacy requests. Do not post personal signup information in public issues.</p>}
    <a className="btn-secondary mt-8" href={sitePath()}>Return to YummyFit</a>
  </main><Footer /></>;
}
