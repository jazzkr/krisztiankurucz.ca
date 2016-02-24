    <?php 

	define('WP_USE_THEMES', false);
	require('/blog/wp-blog-header.php');
    include('header.php'); 
	
	?>
    <!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('img/home-bg.jpg')">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="site-heading">
                        <h1>Krisztian Kurucz</h1>
                        <hr class="small">
                        <span class="subheading">Mechatronics Engineer from UWaterloo.</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

<!-- Main Content -->
	<div class="container">
		<div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
            	<div class="welcome-blurb">
            		<h2 class="home-title">Welcome!</h2>
            		<hr>
					<article>
						Stuff stuff stuff
						<ul>
							<li>blurb about thanking for visting my site</li>
							<li>stuff</li>
							<li>other stuff like what you can find on this site</li>
							<li>stuff</li>
						</ul>
					</article>
				</div>
				<hr class="thick">
				<div class="recent-posts">
					<h2 class="home-title">Recent Posts</h2>
					<hr>
    				<?php 
    					$posts = get_posts('numberposts=5&order=DESC&orderby=date');
						foreach ($posts as $post) : setup_postdata( $post ); ?>
                		<div class="post-preview">
                    		<a href="post.php?p=<?php echo the_id(); ?>">
                        		<h2 class="post-title"><?php the_title(); ?></h2>
                        		<!--TODO: eventually replace with subtitle plugin??? -->
                        		<h3 class="post-subtitle"><?php the_subtitle(); ?></h3>
                    		</a>
                    		<p class="post-meta">Posted by <a href="about.php"><?php the_author(); ?></a> on <?php the_time('F j, Y'); ?></p>
                		</div>
               			<hr>
    				<?php endforeach; ?>
                	<!-- Pager -->
                	<ul class="pager">
                    	<li class="next">
                        	<a href="posts.php">Older Posts &rarr;</a>
                    	</li>
                	</ul>
                </div>
            </div>
        </div>
    </div>
<?php include('footer.php'); ?>

