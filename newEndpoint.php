add_action( 'wp_router_generate_routes', 'bl_add_routes', 20 );

function bl_add_routes( $router ) { 
    $route_args = array(
			'path' => '^contact/(.*?)$',
			'query_vars' => array(
				'sample_argument' => 1,
			),
			'page_callback' => 'contact_callback',
			'page_arguments' => array('sample_argument'),
                        'access_callback' => true,
                        
                        'template' => false
                        //            'page.php',
                        //        dirname( __FILE__ ) . '/page.php'
                        //)
                );

    $router->add_route( 'demo-route-id', $route_args );
}

class ContactInfo {

    public $contact_field_1 ;
    public $contact_field_2 ;
    public $contact_field_3 ;

    /**
     * @var This is of type CompanyInfo
     */
    public $company_info;

    /**
     * @var This is an array to store information of all sent EmailCampaign elements
     */
    public $email_campaigns;

}

class CompanyInfo
{
    public $company_field_1 ;
    public $company_field_2 ;
}

class EmailCampaign
{
    public $name;
    public $to_email;
    public $sent_on;
    public $opened;
    public $clicked;
}


function contact_callback( $argument ) {
        $contactInfo = new ContactInfo(); 
	$contactInfo->contact_field_1 = 'Contact Value 1';
	$contactInfo->contact_field_2 = "Contact Value 2";
	$contactInfo->contact_field_3 = "Contact Value 3";
	
	//2. Populate Company Info
        $contactInfo->company_info = new CompanyInfo();
	$contactInfo->company_info->company_field_1 = "Company Value 1";
	$contactInfo->company_info->company_field_2 = "Company Value 2";

	//return json_encode($contactInfo);
        echo json_encode($contactInfo);

		
	//	echo '<p>This page helpfully tells you the value of the <code>sample_argument</code> query variable: //'.esc_html($argument).'</p>';
	}

